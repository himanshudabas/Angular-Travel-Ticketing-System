import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {Ticket, TicketResolveInfo} from '../../../model/Ticket';
import {AuthenticationService} from '../../../service/authentication.service';
import {NotificationService} from '../../../service/notification.service';
import {ActivatedRoute, Router} from '@angular/router';
import {TicketService} from '../../../service/ticket.service';
import {NotificationType} from '../../../enum/notification-type.enum';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {requiredFileType} from '../../../validator/file-upload.validator';
import {HttpEventType} from '@angular/common/http';
import {TicketStatus} from '../../../enum/ticket-enums';

@Component({
  selector: 'app-admin-view-ticket-details',
  templateUrl: './admin-view-ticket-details.component.html',
  styleUrls: ['./admin-view-ticket-details.component.css']
})
export class AdminViewTicketDetailsComponent implements OnInit, OnDestroy {

  private subscriptions: Subscription[] = [];
  public ticket: Ticket;
  public resolveForm: FormGroup;
  public allStatus: string[] = [];
  public ticketResolveInfo: TicketResolveInfo;
  constructor(
    private authenticationService: AuthenticationService,
    private notificationService: NotificationService,
    private router: Router,
    private route: ActivatedRoute,
    private ticketService: TicketService,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.initResponseForm();
    this.initTicketData();
    this.allStatus = Object.keys(TicketStatus).map(k => TicketStatus[k as any]);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  public submitResolve(): void {
    this.ticketService.changeResolveInfo(this.resolveForm.value, this.ticket.id)
      .subscribe(
        res => {
          if ( res.type === HttpEventType.Response ) {
            this.notificationService.notify(NotificationType.SUCCESS, 'Successfully update the ticket resolve info');
            this.documents.reset();
          }
        },
        error => {
          this.notificationService.notify(NotificationType.ERROR, error.error.message);
        });
  }

  get comment(): FormControl {
    return this.resolveForm.get('comment') as FormControl;
  }
  get documents(): FormControl {
    return this.resolveForm.get('documents') as FormControl;
  }
  get ticketStatus(): FormControl {
    return this.resolveForm.get('ticketStatus') as FormControl;
  }

  private patchFormData(): void {
    this.comment.setValue(this.ticketResolveInfo.comment);
    this.ticketStatus.setValue(this.ticket.ticketStatus);
    // TODO: set documents too somehow
  }

  private initResponseForm(): void {
    this.resolveForm = this.fb.group({
      ticketStatus: ['', [Validators.required]],
      comment: ['', [Validators.maxLength(1000)]],
      documents: [null, [requiredFileType(['png', 'jpg', 'jpeg', 'pdf', 'docx', 'txt', 'doc'])]],
    });
  }

  private initTicketData(): void {
    const ticketId = this.route.snapshot.paramMap.get('ticketId');
    this.subscriptions.push(
      this.ticketService.getTicket(ticketId)
        .subscribe(
          res => {
            this.ticket = res;
            TicketService.enumToString(this.ticket);
            this.initTicketResolveData(ticketId);
          },
          error => {
            this.notificationService.notify(NotificationType.ERROR, error.error.message);
            this.router.navigateByUrl('/admin/tickets');
          }
        )
    );
  }

  private initTicketResolveData(ticketId: string): void {
    this.subscriptions.push(
      this.ticketService.getTicketResolveInfo(ticketId)
        .subscribe(
          res => {
            this.ticketResolveInfo = res;
            this.patchFormData();
          },
          error => {
            this.notificationService.notify(NotificationType.ERROR, error.error.message);
            this.router.navigateByUrl('/admin/tickets');
          }
        )
    );
  }
}
