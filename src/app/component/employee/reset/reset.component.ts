import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthenticationService} from '../../../service/authentication.service';
import {NotificationService} from '../../../service/notification.service';
import {GmailEmailValidator} from '../../../validator/gmail-email.validator';
import {Subscription} from 'rxjs';
import {EmployeeLoginDto} from '../../../model/employee-login.dto';
import {HttpErrorResponse} from '@angular/common/http';
import {NotificationType} from '../../../enum/notification-type.enum';
import {EmployeeService} from '../../../service/employee.service';
import {CustomHttpResponse} from '../../../model/custom-http-response';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.css']
})
export class ResetComponent implements OnInit, OnDestroy {

  private subscriptions: Subscription[] = [];
  public resetForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService,
    private employeeService: EmployeeService,
    private notificationService: NotificationService,
  ) { }

  ngOnInit(): void {
    this.router.navigateByUrl('/resetPassword');
    this.initEditForm();
  }

  private initEditForm(): void {
    this.resetForm = this.fb.group({
      username: ['', [Validators.required, Validators.email, GmailEmailValidator]],
    });
  }

  get username(): any {
    return this.resetForm.get('username');
  }

  public reset(): void {
    const employeeLoginDto: EmployeeLoginDto = this.resetForm.value;
    this.subscriptions.push(
      this.employeeService.resetPassword(employeeLoginDto.username).subscribe(
        (response: CustomHttpResponse) => {
          this.router.navigateByUrl('/login');
          this.sendNotification(NotificationType.SUCCESS,
            response.message);
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
        }
      )
    );
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
