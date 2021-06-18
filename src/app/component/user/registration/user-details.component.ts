import {Component, OnDestroy, OnInit} from '@angular/core';
import {User} from '../../../model/User';
import {Router} from '@angular/router';
import {UserService} from '../../../service/user.service';
import {Subscription} from 'rxjs';
import {AuthenticationService} from '../../../service/authentication.service';
import {NotificationService} from '../../../service/notification.service';
import {NotificationType} from '../../../enum/notification-type.enum';

@Component({
  selector: 'app-registration',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit, OnDestroy {
  showConfirmation: boolean;
  userData: User;
  isEditPage: boolean;
  private subscriptions: Subscription[] = [];

  constructor(
    private router: Router,
    private userService: UserService,
    private authenticationService: AuthenticationService,
    private notificationService: NotificationService,
  ) { }

  ngOnInit(): void {
    this.showConfirmation = false;
    if (this.router.url === '/register') {
      this.isEditPage = false;
      this.userData = new User();
    } else if (this.router.url === '/user/edit') {
      this.isEditPage = true;
      this.subscriptions.push(
        this.userService.getUser()
          .subscribe(
            data => this.userData = data,
            error => this.notificationService.notify(NotificationType.ERROR, error.error.message),
          )
      );
    }
  }

  confirm(user: User): void {
    this.userData = user;
    this.showConfirmation = true;
  }

  public showEditPage(): void {
    this.showConfirmation = false;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
