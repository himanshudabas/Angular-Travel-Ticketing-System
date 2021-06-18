import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Ticket} from '../../../../../model/Ticket';
import {ActivatedRoute, Router} from '@angular/router';
import {NotificationService} from '../../../../../service/notification.service';
import {NotificationType} from '../../../../../enum/notification-type.enum';

@Component({
  selector: 'app-ticket-confirmation',
  templateUrl: './ticket-confirmation.component.html',
  styleUrls: ['./ticket-confirmation.component.css']
})
export class TicketConfirmationComponent implements OnInit {

  @Input() ticket: Ticket;
  @Input() isEditPage: boolean;
  @Output() editTicketEvent: EventEmitter<null> = new EventEmitter<null>();

  constructor(
    private router: Router,
    private notificationService: NotificationService,
  ) {}

  ngOnInit(): void {
  }

  printTicket(): void {
    window.print();
  }

  editTicket(): void {
    this.editTicketEvent.emit();
    const ticketId = this.ticket.id;
    this.router.navigateByUrl(`/tickets/edit/${ticketId}`);
  }

  confirmTicket(): void {
    this.notificationService.notify(NotificationType.SUCCESS, 'SUCCESS! Your ticket has been submitted successfully');
    this.router.navigateByUrl('/home');
  }
}
