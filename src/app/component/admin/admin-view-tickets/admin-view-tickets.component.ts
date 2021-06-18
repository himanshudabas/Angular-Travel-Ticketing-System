import { Component, OnDestroy, OnInit } from '@angular/core';
import { Ticket } from '../../../model/Ticket';
import { Subscription } from 'rxjs';
import { TicketService } from '../../../service/ticket.service';
import { NotificationService } from '../../../service/notification.service';
import { AuthenticationService } from '../../../service/authentication.service';
import { Router } from '@angular/router';
import { NotificationType } from '../../../enum/notification-type.enum';
import { PageEvent } from '@angular/material/paginator';
import {
  getTicketPriorityOrdinal,
  TicketFilterType,
  TicketPriorityType,
  TicketSortType
} from '../../../enum/ticket-enums';
import { UserService } from '../../../service/user.service';
import { User } from '../../../model/User';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-admin-view-tickets',
  templateUrl: './admin-view-tickets.component.html',
  styleUrls: ['./admin-view-tickets.component.css']
})
export class AdminViewTicketsComponent implements OnInit, OnDestroy {

  public totalTickets: number;
  public allFilteredTickets: Array<Ticket>;
  public visibleTicketsProgressList: number[];
  public visibleTickets: Array<Ticket>;
  private subscriptions: Subscription[] = [];
  private activePaginationIdx = 0;
  private activePaginationPageSize = 5;
  public filterTypeList: { name: any; value: string }[];
  public sortByList: { name: any; value: string }[];
  public filterValueList: { name: any; value: string }[];
  private globalUsersMap: Record<number, User> = {};
  private globalTickets: Array<Ticket>;
  // type of filter currently active
  public activeFilterType: TicketFilterType;
  // selected value for the current filter type
  public activeFilterValue: string;
  // this is used to display in the select filter value filed
  // activeFilterValue is all caps so looks bad
  public activeFilterTypeDisplayName: string;
  // currently selected sort type
  public activeSortType: string = Object.keys(TicketSortType)[0];
  public isFilterValueVisible: boolean;
  public showTicketsBool: boolean;



  constructor(
    private ticketService: TicketService,
    private notificationService: NotificationService,
    private userService: UserService,
  ) { }


  ngOnInit(): void {
    this.showTicketsBool = true;
    this.initAllTicketsData();
    this.initSelectFieldData();
  }

  // fetch all tickets from the server
  // then fetch all users details
  private initAllTicketsData(): void {
    this.subscriptions.push(
      this.ticketService.getAllTickets()
        .subscribe(
          res => {
            this.globalTickets = res;
            this.totalTickets = this.globalTickets.length;
            this.globalTickets.forEach(tkt => TicketService.enumToString(tkt));
            this.initAllUsersData();
          },
          error => {
            this.notificationService.notify(NotificationType.ERROR, error.error.message);
          }
        )
    );
  }

  // fetch all users from the server and filter those who owns some ticket
  private initAllUsersData(): void {
    this.subscriptions.push(
      this.userService.getAllUsers()
        .subscribe(
          (res: Record<number, User>) => {
            this.storeValidUsersFromAllUsers(res);
            this.updateVisibleTicketDetails();
          },
          error => {
            this.notificationService.notify(NotificationType.ERROR, error.error.message);
          }
        )
    );
  }

  // fired on pagination page click
  public onChangePage(pe: PageEvent): void {
    this.activePaginationIdx = pe.pageIndex;
    this.activePaginationPageSize = pe.pageSize;
    this.updateVisibleTicketDetails();
  }

  // update visible ticket details
  private updateVisibleTicketDetails(): void {
    this.filterThenSortTickets();
    this.sliceFilteredTicketsForPagination();
  }

  // this will first filter the tickets based on user selection and then sort them for pagination
  private filterThenSortTickets(): void {
    this.filterTickets();
    this.sortTickets();
  }

  // function to filter tickets when a filter is applied from the component
  private filterTickets(): void {
    switch (TicketFilterType[this.activeFilterType]) {
      case TicketFilterType.BUSINESS_UNIT:
        // 1st we filter all the tickets whose owner has the specified business unit
        this.allFilteredTickets = this.globalTickets.filter(
          tkt => {
            if (this.globalUsersMap[tkt.userId].businessUnit === this.activeFilterValue) {
              return true;
            }
          }
        );
        break;
      case TicketFilterType.PERSON:
        this.allFilteredTickets = this.globalTickets.filter(
          tkt => {
            if (tkt.userId.toString() === this.activeFilterValue) {
              return true;
            }
          }
        );
        break;
      case TicketFilterType.PRIORITY:
        this.allFilteredTickets = this.globalTickets.filter(
          tkt => {
            return tkt.priority === TicketPriorityType[this.activeFilterValue];
          }
        );
        break;
      case TicketFilterType.PROJECT_NAME:
        this.allFilteredTickets = this.globalTickets.filter(
          tkt => {
            return tkt.projectName === this.activeFilterValue;
          }
        );
        break;
      default:
        this.allFilteredTickets = this.globalTickets;
        this.isFilterValueVisible = false;
    }
    this.totalTickets = this.allFilteredTickets.length;
    this.sortTickets();
  }

  // this will sort all filtered tickets
  private sortTickets(): void {
    switch (TicketSortType[this.activeSortType]) {
      case TicketSortType.DATE:
        const temp = this.allFilteredTickets.sort((a, b) => {
          if (b.submitDate < a.submitDate) { return 1; }
          else { return -1; }
        });
        this.allFilteredTickets = new Array<Ticket>();
        this.allFilteredTickets = temp;
        break;
      case TicketSortType.PRIORITY:
        const temp2 = this.allFilteredTickets.sort((a, b) => {
          const x = getTicketPriorityOrdinal(a.priority);
          const y = getTicketPriorityOrdinal(b.priority);
          return y - x;
        });
        this.allFilteredTickets = new Array<Ticket>();
        this.allFilteredTickets = temp2;
        break;

      default:
    }
  }

  // Select tickets from filtered tickets based on the page number of pagination
  // and put the selected tickets in visible tickets variables
  private sliceFilteredTicketsForPagination(): void {
    const start = this.activePaginationIdx * this.activePaginationPageSize;
    this.visibleTickets = this.allFilteredTickets.slice(start, start + this.activePaginationPageSize);
    this.visibleTicketsProgressList = this.visibleTickets.map(x => TicketService.getProgressValueFromStatus(x.ticketStatus));
  }

  // from the list of all the users that the server sends
  // store only those which have created some ticket
  private storeValidUsersFromAllUsers(res: Record<number, User>): void {
    this.globalTickets.forEach(
      tkt => {
        if (res[tkt.userId] !== undefined) {
          this.globalUsersMap[tkt.userId] = res[tkt.userId];
        }
      }
    );
  }

  // called when user selects the sort type
  public onFilterTypeChange($event: MatSelectChange): void {
    this.populateFilterValueList();
    this.isFilterValueVisible = !!$event.value;
    this.activeFilterTypeDisplayName = this.activeFilterType ?
      (TicketFilterType[this.activeFilterType]).toUpperCase() : '';
    if (this.activeFilterType === undefined) {
      this.updateVisibleTicketDetails();
    }
  }

  // called when user selects some filter value
  public onFilterValueChange(): void {
    // this.activeFilterValue = $event.target;
    this.sortTickets();
    this.filterTickets();
    this.sliceFilteredTicketsForPagination();
    this.reload();
  }

  // called when user selects the sort type
  public onSortChange(): void {
    // this.activeSortType = $event.target;
    this.sortTickets();
    this.sliceFilteredTicketsForPagination();
    this.reload();
  }

  private initSelectFieldData(): void {
    this.filterTypeList = Object.keys(TicketFilterType).map(
      key => {
        return {
          value: key,
          name: TicketFilterType[key]
        };
      }
    );
    this.sortByList = Object.keys(TicketSortType).map(
      key => {
        return {
          value: key,
          name: TicketSortType[key]
        };
      }
    );
  }

  private reload(): void {
    this.showTicketsBool = false;
    setTimeout(() => this.showTicketsBool = true);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private groupBy = (xs, key) => {
    return xs.reduce((rv, x) => {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  }

  private populateFilterValueList(): void {
    switch (TicketFilterType[this.activeFilterType]) {
      case TicketFilterType.PERSON:
        const allUsers = [];
        for (const [userid, value] of Object.entries(this.globalUsersMap)) {
          allUsers.push({
            value: userid,
            name: (`${value.firstName} ${value.lastName}`)
          });
        }
        this.filterValueList = allUsers;
        break;
      case TicketFilterType.PRIORITY:
        this.filterValueList = Object.keys(TicketPriorityType).map(
          key => {
            return {
              name: TicketPriorityType[key],
              value: key
            };
          }
        );
        break;
      case TicketFilterType.BUSINESS_UNIT:
        this.filterValueList = Object.keys(this.groupBy(Object.values(this.globalUsersMap), 'businessUnit'))
          .map(key => {
            return {
              name: key,
              value: key
            };
          });
        break;
      case TicketFilterType.PROJECT_NAME:
        this.filterValueList = Object.keys(this.groupBy(this.globalTickets, 'projectName'))
          .map(key => {
            return {
              name: key,
              value: key
            };
          });
        break;
      default:
    }
  }
}
