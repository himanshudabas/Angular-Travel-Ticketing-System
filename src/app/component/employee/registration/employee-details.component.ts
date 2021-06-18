import {Component, OnDestroy, OnInit} from '@angular/core';
import {Employee} from '../../../model/Employee';
import {Router} from '@angular/router';
import {EmployeeService} from '../../../service/employee.service';
import {Subscription} from 'rxjs';
import {AuthenticationService} from '../../../service/authentication.service';
import {NotificationService} from '../../../service/notification.service';
import {NotificationType} from '../../../enum/notification-type.enum';

@Component({
  selector: 'app-registration',
  templateUrl: './employee-details.component.html',
  styleUrls: ['./employee-details.component.css']
})
export class EmployeeDetailsComponent implements OnInit, OnDestroy {
  showConfirmation: boolean;
  employeeData: Employee;
  isEditPage: boolean;
  private subscriptions: Subscription[] = [];

  constructor(
    private router: Router,
    private employeeService: EmployeeService,
    private authenticationService: AuthenticationService,
    private notificationService: NotificationService,
  ) { }

  ngOnInit(): void {
    this.showConfirmation = false;
    if (this.router.url === '/register') {
      this.isEditPage = false;
      this.employeeData = new Employee();
    } else if (this.router.url === '/employee/edit') {
      this.isEditPage = true;
      this.subscriptions.push(
        this.employeeService.getEmployee()
          .subscribe(
            data => this.employeeData = data,
            error => this.notificationService.notify(NotificationType.ERROR, error.error.message),
          )
      );
    }
  }

  confirm(employee: Employee): void {
    this.employeeData = employee;
    this.showConfirmation = true;
  }

  public showEditPage(): void {
    this.showConfirmation = false;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
