import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {User} from '../../../../model/User';
import {GmailEmailValidator} from '../../../../validator/gmail-email.validator';
import {SelectFieldValidator} from '../../../../validator/select-field.validator';
import {AuthenticationService} from '../../../../service/authentication.service';
import {UserService} from '../../../../service/user.service';
import {Subscription} from 'rxjs';
import {NotificationService} from '../../../../service/notification.service';
import {NotificationType} from '../../../../enum/notification-type.enum';

@Component({
  selector: 'app-register',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit, OnDestroy, OnChanges {

  @Input() user: User;
  @Input() isEditPage: boolean;
  userDetailsForm: any;
  allCountries: string[];
  allStates: string[];
  private subscriptions: Subscription[] = [];
  @Output() submitEvent: EventEmitter<User> = new EventEmitter<User>();

  constructor(
    private fb: FormBuilder,
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private notificationService: NotificationService,
  ) { }

  ngOnInit(): void {
    this.allCountries = ['India', 'USA'];
    this.allStates = ['Uttar Pradesh', 'Delhi', 'Haryana'];
    if (!this.userDetailsForm) {
      this.initUserDetailsForm();
    }
  }

  public initUserDetailsForm(): void {
    this.userDetailsForm = this.fb.group({
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
    if (this.isEditPage) { // edit existing user details
      this.subscriptions.push(
        this.userService.updateUser(this.userDetailsForm.value)
          .subscribe(
            res => this.submitEvent.emit(res),
            error => this.notificationService.notify(NotificationType.ERROR, error.error.message)
          )
      );
    } else { // do new registration
      this.subscriptions.push(
        this.authenticationService.register(this.userDetailsForm.value)
          .subscribe(
            res => {
              this.authenticationService.saveTokenAndUser(res);
              this.submitEvent.emit(res.body);
            },
              error => this.notificationService.notify(NotificationType.ERROR, error.error.message)
          )
      );
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.user) {
      if (!this.userDetailsForm) {
        this.initUserDetailsForm();
      }
      this.userDetailsForm.patchValue(this.user);
    }
  }

  get firstName(): any {
    return this.userDetailsForm.get('firstName');
  }
  get lastName(): any {
    return this.userDetailsForm.get('lastName');
  }
  get businessUnit(): any {
    return this.userDetailsForm.get('businessUnit');
  }
  get title(): any {
    return this.userDetailsForm.get('title');
  }
  get telephone(): any {
    return this.userDetailsForm.get('telephone');
  }
  get email(): any {
    return this.userDetailsForm.get('email');
  }
  get address1(): any {
    return this.userDetailsForm.get('address.address1');
  }
  get address2(): any {
    return this.userDetailsForm.get('address.address2');
  }
  get city(): any {
    return this.userDetailsForm.get('address.city');
  }
  get state(): any {
    return this.userDetailsForm.get('address.state');
  }
  get zipCode(): any {
    return this.userDetailsForm.get('address.zipCode');
  }
  get country(): any {
    return this.userDetailsForm.get('address.country');
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
