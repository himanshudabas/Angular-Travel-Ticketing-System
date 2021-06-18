import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {GmailEmailValidator} from '../../validator/gmail-email.validator';
import {AuthenticationService} from '../../service/authentication.service';
import {NotificationService} from '../../service/notification.service';
import {UserLoginDto} from '../../model/user-login.dto';
import {Subscription} from 'rxjs';
import {HttpErrorResponse, HttpResponse} from '@angular/common/http';
import {NotificationType} from '../../enum/notification-type.enum';
import {User} from '../../model/User';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  public isAdminLogin: boolean;
  private subscriptions: Subscription[] = [];
  public loginForm: FormGroup;
  @Output('activate') public loginEvent: EventEmitter<User> = new EventEmitter<User>();

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService,
    private notificationService: NotificationService,
    ) {}

  ngOnInit(): void {
    this.isAdminLogin = this.router.url.startsWith('/admin/login');
    this.initLoginForm();
  }

  private initLoginForm(): void {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.email, GmailEmailValidator]],
      password: ['', Validators.required],
    });
  }

  public onLogin(): void {
    const userLoginDto: UserLoginDto = this.loginForm.value;
    this.subscriptions.push(
      this.authenticationService.login(userLoginDto).subscribe(
        (res: HttpResponse<User>) => {
          this.authenticationService.saveTokenAndUser(res);
          this.loginEvent.emit(res.body);
          this.sendNotification(NotificationType.SUCCESS, `Login successful`);
          if (res.body.isAdmin) {
            this.router.navigateByUrl('/admin/tickets');
          } else {
            this.router.navigateByUrl('/home');
          }
        },
      (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
        }
      )
    );
  }

  get username(): any {
    return this.loginForm.get('username');
  }

  get password(): any {
    return this.loginForm.get('password');
  }

  private sendNotification(type: NotificationType, message: string): void {
    if (message) {
      this.notificationService.notify(type, message);
    } else {
      this.notificationService.notify(type, `Some Error Occurred. Please Try Again`);
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
