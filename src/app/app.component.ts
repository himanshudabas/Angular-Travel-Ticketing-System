import {Component, OnDestroy, OnInit, Output} from '@angular/core';
import {AuthenticationService} from './service/authentication.service';
import {Router} from '@angular/router';
import {NotificationService} from './service/notification.service';
import {NotificationType} from './enum/notification-type.enum';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  @Output() public loggedInUserType: string;
  public isAdminLoginPage: boolean;
  private subscriptions: Subscription[];

  constructor(
    private authenticationService: AuthenticationService,
    private notificationService: NotificationService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.updateLoginStatus();
  }

  private updateLoginStatus(): void {
    if (this.authenticationService.isUserLoggedIn()) {
      this.loggedInUserType = 'USER';
    } else if (this.authenticationService.isAdminLoggedIn()) {
      this.loggedInUserType = 'ADMIN';
    } else {
      this.loggedInUserType = 'GUEST';
    }
  }

  public logout(): void {
    this.authenticationService.logOut();
    this.loggedInUserType = 'GUEST';
    this.notificationService.notify(NotificationType.SUCCESS, 'Successfully logged out');
    this.router.navigateByUrl('/login');
  }

  onActivate($event: any): void {
    this.isAdminLoginPage = this.router.url.startsWith('/admin/login');
    this.updateLoginStatus();

  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
