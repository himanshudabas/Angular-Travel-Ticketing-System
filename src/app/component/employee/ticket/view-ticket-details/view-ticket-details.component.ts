import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthenticationService} from '../../../../service/authentication.service';
import {NotificationService} from '../../../../service/notification.service';
import {ActivatedRoute, Router} from '@angular/router';
import {NotificationType} from '../../../../enum/notification-type.enum';
import {TicketService} from '../../../../service/ticket.service';
import {Subscription} from 'rxjs';
import {Ticket, TicketResolveInfo} from '../../../../model/Ticket';
import {saveAs as importedSaveAs} from 'file-saver';

@Component({
  selector: 'app-view-ticket-details',
  templateUrl: './view-ticket-details.component.html',
  styleUrls: ['./view-ticket-details.component.css']
})
export class ViewTicketDetailsComponent implements OnInit, OnDestroy {

  private subscriptions: Subscription[] = [];
  public ticket: Ticket;
  public ticketResolveInfo: TicketResolveInfo;
  constructor(
    private authenticationService: AuthenticationService,
    private notificationService: NotificationService,
    private router: Router,
    private route: ActivatedRoute,
    private ticketService: TicketService,
  ) { }

  ngOnInit(): void {
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
          }
        )
    );
  }

  printTicket(): void {
    window.print();
  }

  private initTicketResolveData(ticketId: string): void {
    this.subscriptions.push(
      this.ticketService.getTicketResolveInfo(ticketId)
        .subscribe(
          res => {
            this.ticketResolveInfo = res;
          },
          error => {
            this.notificationService.notify(NotificationType.ERROR, error.error.message);
            this.router.navigateByUrl('/admin/tickets');
          }
        )
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  getDocument(id: number, fileName: string): void {
    this.ticketService.getDocument(id)
      .subscribe(
        res => {
          importedSaveAs(res, fileName);
          console.log(res);
        },
        error => {
          console.log(error.error.message);
        }
      );
  }
}
