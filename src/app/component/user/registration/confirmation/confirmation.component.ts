import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {User} from '../../../../model/User';
import {Router} from '@angular/router';
import {NotificationService} from '../../../../service/notification.service';
import {NotificationType} from '../../../../enum/notification-type.enum';
import {AuthenticationService} from '../../../../service/authentication.service';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.css']
})
export class ConfirmationComponent implements OnInit {

  @Input() user: User;
  @Input() isEditPage: boolean;
  @Output() editDetailsEvent: EventEmitter<null> = new EventEmitter<null>();

  constructor(
    private router: Router,
    private notificationService: NotificationService,
    private authenticationService: AuthenticationService,
  ) {}

  ngOnInit(): void {
  }

  printDetails(): void {
    window.print();
  }

  editRegistration(): void {
    this.editDetailsEvent.emit();
    this.router.navigateByUrl('/user/edit');
  }

  confirmRegistration(): void {
    if (this.isEditPage) {
      this.notificationService.notify(NotificationType.SUCCESS, 'SUCCESS! Successfully edited your details');
      this.router.navigateByUrl('/home');
    } else {
      this.notificationService.notify(NotificationType.SUCCESS, 'REGISTERED! Check you email for login Credentials');
      this.authenticationService.logOut();
      this.router.navigateByUrl('/login');
    }
  }
}
