import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {Employee} from '../../../../model/Employee';
import {GmailEmailValidator} from '../../../../validator/gmail-email.validator';
import {SelectFieldValidator} from '../../../../validator/select-field.validator';
import {AuthenticationService} from '../../../../service/authentication.service';
import {EmployeeService} from '../../../../service/employee.service';
import {Subscription} from 'rxjs';
import {NotificationService} from '../../../../service/notification.service';
import {NotificationType} from '../../../../enum/notification-type.enum';

@Component({
  selector: 'app-register',
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.css']
})
export class EmployeeFormComponent implements OnInit, OnDestroy, OnChanges {

  @Input() employee: Employee;
  @Input() isEditPage: boolean;
  employeeDetailsForm: any;
  allCountries: string[];
  allStates: string[];
  private subscriptions: Subscription[] = [];
  @Output() submitEvent: EventEmitter<Employee> = new EventEmitter<Employee>();

  constructor(
    private fb: FormBuilder,
    private authenticationService: AuthenticationService,
    private employeeService: EmployeeService,
    private notificationService: NotificationService,
  ) { }

  ngOnInit(): void {
    this.allCountries = ['India', 'USA'];
    this.allStates = ['Uttar Pradesh', 'Delhi', 'Haryana'];
    if (!this.employeeDetailsForm) {
      this.initEmployeeDetailsForm();
    }
  }

  public initEmployeeDetailsForm(): void {
    this.employeeDetailsForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      businessUnit: ['', Validators.required],
      title: ['', Validators.required],
      email: ['', [Validators.required, Validators.email, GmailEmailValidator]],
      telephone: ['', [Validators.required, Validators.maxLength(15)]],
      address: this.fb.group({
        address1: ['', Validators.required],
        address2: [],
        city: ['', Validators.required],
        state: ['', SelectFieldValidator],
        zipCode: ['', Validators.required],
        country: ['', SelectFieldValidator],
      })
    });
  }

  submitDetails(): void {
    if (this.isEditPage) { // edit existing employee details
      this.subscriptions.push(
        this.employeeService.updateEmployee(this.employeeDetailsForm.value)
          .subscribe(
            res => this.submitEvent.emit(res),
            error => this.notificationService.notify(NotificationType.ERROR, error.error.message)
          )
      );
    } else { // do new registration
      this.subscriptions.push(
        this.authenticationService.register(this.employeeDetailsForm.value)
          .subscribe(
            res => {
              this.authenticationService.saveTokenAndEmployee(res);
              this.submitEvent.emit(res.body);
            },
              error => this.notificationService.notify(NotificationType.ERROR, error.error.message)
          )
      );
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.employee) {
      if (!this.employeeDetailsForm) {
        this.initEmployeeDetailsForm();
      }
      this.employeeDetailsForm.patchValue(this.employee);
    }
  }

  get firstName(): any {
    return this.employeeDetailsForm.get('firstName');
  }
  get lastName(): any {
    return this.employeeDetailsForm.get('lastName');
  }
  get businessUnit(): any {
    return this.employeeDetailsForm.get('businessUnit');
  }
  get title(): any {
    return this.employeeDetailsForm.get('title');
  }
  get telephone(): any {
    return this.employeeDetailsForm.get('telephone');
  }
  get email(): any {
    return this.employeeDetailsForm.get('email');
  }
  get address1(): any {
    return this.employeeDetailsForm.get('address.address1');
  }
  get address2(): any {
    return this.employeeDetailsForm.get('address.address2');
  }
  get city(): any {
    return this.employeeDetailsForm.get('address.city');
  }
  get state(): any {
    return this.employeeDetailsForm.get('address.state');
  }
  get zipCode(): any {
    return this.employeeDetailsForm.get('address.zipCode');
  }
  get country(): any {
    return this.employeeDetailsForm.get('address.country');
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
