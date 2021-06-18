import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ExpenseBorneByType, TicketPriorityType, TicketType} from '../../../../enum/ticket-enums';
import {Ticket} from '../../../../model/Ticket';
// @ts-ignore
import * as statesJson from '../cities.constants.json';
import {TicketService} from '../../../../service/ticket.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {NotificationService} from '../../../../service/notification.service';
import {NotificationType} from '../../../../enum/notification-type.enum';
import {AuthenticationService} from '../../../../service/authentication.service';

@Component({
  selector: 'app-create-ticket',
  templateUrl: './create-ticket.component.html',
  styleUrls: ['./create-ticket.component.css']
})
export class CreateTicketComponent implements OnInit, OnDestroy {

  public ticketForm: FormGroup;
  public ticket: Ticket;
  public allStates: Array<string>;
  public allTicketTypes: Array<string>;
  public allPriorityTypes: Array<string>;
  public isEditPage: boolean;
  public showConfirmation: boolean;
  private subscriptions: Subscription[] = [];

  constructor(
    private notificationService: NotificationService,
    private fb: FormBuilder,
    private ticketService: TicketService,
    private router: Router,
    private route: ActivatedRoute,
    private authenticationService: AuthenticationService,
  ) { }

  ngOnInit(): void {
    this.showConfirmation = false;
    const currPath: string = this.router.url;
    if (currPath.startsWith('/tickets/create')) {
      this.isEditPage = false;
      this.ticket = new Ticket();
    } else if (currPath.startsWith('/tickets/edit/')) {
      this.isEditPage = true;
      const ticketId = this.route.snapshot.paramMap.get('ticketId');
      this.subscriptions.push(
        this.ticketService.getTicket(ticketId)
          .subscribe(
            data => {
              this.ticket = data;
              this.enumMapUtil();
              this.ticketForm.patchValue(this.ticket);
            },
            error => {
              this.notificationService.notify(NotificationType.ERROR, error.error.message);
              this.router.navigateByUrl('/home');
            }
          )
      );
    }

    this.allStates = (statesJson as any).default.cities;
    this.allTicketTypes = Object.keys(TicketType).map(k => TicketType[k as any]);
    this.allPriorityTypes = Object.keys(TicketPriorityType).map(k => TicketPriorityType[k as any]);
    this.ticket = new Ticket();
    if (!this.ticketForm) {
      this.initTicketForm();
      this.ticketForm.patchValue(this.ticket);
    }
  }

  private initTicketForm(): void {
    this.ticketForm = this.fb.group({
      type: ['', Validators.required],
      priority: ['', Validators.required],
      travelTo: ['', Validators.required],
      travelFrom: ['', Validators.required],
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
      passportNumber: ['', [Validators.required, Validators.maxLength(25)]],
      projectName: ['', [Validators.required, Validators.maxLength(100)]],
      borneBy: ['', [Validators.required]],
      approverName: ['', [Validators.maxLength(100)]],
      expectedDuration: ['', [Validators.maxLength(100)]],
      maxAllowedAmount: ['', [Validators.maxLength(500)]],
      moreDetails: ['', [Validators.required, Validators.maxLength(1000)]],
    });
  }

  submitTicket(): void {
    if (this.isEditPage) {
      const ticketId = this.route.snapshot.paramMap.get('ticketId');
      this.subscriptions.push(
        this.ticketService.updateTicket(this.ticketForm.value, ticketId)
          .subscribe(
            res => {
              this.ticket = res;
              this.enumMapUtil();
              this.showConfirmation = true;
            },
            error => {
              this.notificationService.notify(NotificationType.ERROR, error.error.message);
            }
          )
      );
    } else {
      this.subscriptions.push(
        this.ticketService.createTicket(this.ticketForm.value)
          .subscribe(
            res => {
              this.ticket = res;
              this.enumMapUtil();
              this.showConfirmation = true;
            },
            error => {
              this.notificationService.notify(NotificationType.ERROR, error.error.message);
            }
          )
      );
    }
  }

  /*
  Getters for form elements
  */
  get type(): any {
    return this.ticketForm.get('type');
  }
  get priority(): any {
    return this.ticketForm.get('priority');
  }
  get travelTo(): any {
    return this.ticketForm.get('travelTo');
  }
  get travelFrom(): any {
    return this.ticketForm.get('travelFrom');
  }
  get startDate(): any {
    return this.ticketForm.get('startDate');
  }
  get endDate(): any {
    return this.ticketForm.get('endDate');
  }
  get passportNumber(): any {
    return this.ticketForm.get('passportNumber');
  }
  get projectName(): any {
    return this.ticketForm.get('projectName');
  }
  get borneBy(): any {
    return this.ticketForm.get('borneBy');
  }
  get approverName(): any {
    return this.ticketForm.get('approverName');
  }
  get expectedDuration(): any {
    return this.ticketForm.get('expectedDuration');
  }
  get maxAllowedAmount(): any {
    return this.ticketForm.get('maxAllowedAmount');
  }
  get moreDetails(): any {
    return this.ticketForm.get('moreDetails');
  }

  private enumMapUtil(): void {
    this.ticket.type = TicketType[this.ticket.type];
    this.ticket.priority = TicketPriorityType[this.ticket.priority];
    this.ticket.borneBy = ExpenseBorneByType[this.ticket.borneBy];

  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  public editTicketEvent(): void {
    this.showConfirmation = false;
  }
}
