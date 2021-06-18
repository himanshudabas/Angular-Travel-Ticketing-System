import {Component, OnDestroy, OnInit} from '@angular/core';
import {PageEvent} from '@angular/material/paginator';
import {Ticket} from '../../../../model/Ticket';
import {Subscription} from 'rxjs';
import {TicketService} from '../../../../service/ticket.service';
import {NotificationService} from '../../../../service/notification.service';
import {NotificationType} from '../../../../enum/notification-type.enum';
import {AuthenticationService} from "../../../../service/authentication.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-view-tickets',
  templateUrl: './view-tickets.component.html',
  styleUrls: ['./view-tickets.component.css']
})
export class ViewTicketsComponent implements OnInit, OnDestroy {

  public totalTickets: number;
  public currTicketsProgress: number[];
  public allTickets: Array<Ticket>;
  public currTickets: Array<Ticket>;
  private subscriptions: Subscription[] = [];
  private currPageIdx = 0;
  private currPageSize = 5;

  constructor(
    private ticketService: TicketService,
    private notificationService: NotificationService,
    private authenticationService: AuthenticationService,
    private router: Router,
  ) { }


  ngOnInit(): void {
    this.initAllTicketsData();
  }

  private initAllTicketsData(): void {
    this.subscriptions.push(
      this.ticketService.getAllTickets()
        .subscribe(
          res => {
            this.allTickets = res;
            this.totalTickets = this.allTickets.length;
            this.allTickets.forEach(tkt => TicketService.enumToString(tkt));
            this.updateCurrTicketDetails();
          },
          error => {
            this.notificationService.notify(NotificationType.ERROR, error.error.message);
          }
        )
    );
  }

  public onChangePage(pe: PageEvent): void {
    this.currPageIdx = pe.pageIndex;
    this.currPageSize = pe.pageSize;
    this.updateCurrTicketDetails();
  }

  private updateCurrTicketDetails(): void {
    const start = this.currPageIdx * this.currPageSize;
    this.currTickets = this.allTickets.slice(start, start + this.currPageSize);
    this.currTicketsProgress = this.currTickets.map(x => TicketService.getProgressValueFromStatus(x.ticketStatus));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

}
