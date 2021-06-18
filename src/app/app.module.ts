import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HomeComponent} from './component/home/home.component';
import {ReactiveFormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {EmployeeService} from './service/employee.service';
import {EmployeeAuthenticationGuard} from './guard/employee-authentication-guard.service';
import {NotificationModule} from './notification.module';
import {AuthInterceptor} from './interceptor/auth.interceptor';
import {LoginComponent} from './component/login/login.component';
import {NotificationService} from './service/notification.service';
import {EmployeeDetailsComponent} from './component/employee/registration/employee-details.component';
import {EmployeeFormComponent} from './component/employee/registration/employee-form/employee-form.component';
import {Error404Component} from './component/error404/error404.component';
import {AuthenticationService} from './service/authentication.service';
import {ChartsModule} from 'ng2-charts';
import {DatePipe} from '@angular/common';
import {AutocompleteLibModule} from 'angular-ng-autocomplete';
import {MaterialModule} from './material.module';
import {MatInputModule} from '@angular/material/input';
import {MatPaginatorModule} from '@angular/material/paginator';
import { AdminViewTicketsComponent } from './component/admin/admin-view-tickets/admin-view-tickets.component';
import { AdminViewTicketDetailsComponent } from './component/admin/admin-view-ticket-details/admin-view-ticket-details.component';
import {FileUploadComponent} from './component/utility/file-upload.component';
import {MatSelectModule} from '@angular/material/select';
import {AdminAuthenticationGuard} from './guard/admin-authentication.guard';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { ConfirmationComponent } from './component/employee/registration/confirmation/confirmation.component';
import { ResetComponent } from './component/employee/reset/reset.component';
import { TicketConfirmationComponent } from './component/employee/ticket/create/confirmation/ticket-confirmation.component';
import { CreateTicketComponent } from './component/employee/ticket/create/create-ticket.component';
import { ViewTicketDetailsComponent } from './component/employee/ticket/view-ticket-details/view-ticket-details.component';
import { ViewTicketsComponent } from './component/employee/ticket/view/view-tickets.component';

@NgModule({
  declarations: [
    AppComponent,
    FileUploadComponent,
    LoginComponent,
    TicketConfirmationComponent,
    EmployeeFormComponent,
    HomeComponent,
    ResetComponent,
    EmployeeDetailsComponent,
    ConfirmationComponent,
    ViewTicketsComponent,
    Error404Component,
    CreateTicketComponent,
    ViewTicketDetailsComponent,
    AdminViewTicketsComponent,
    AdminViewTicketDetailsComponent,
  ],
  imports: [
    AppRoutingModule,
    MatAutocompleteModule,
    BrowserModule,
    MatPaginatorModule,
    MaterialModule,
    AutocompleteLibModule,
    BrowserModule,
    ChartsModule,
    HttpClientModule,
    NotificationModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
  ],
  providers: [
    EmployeeAuthenticationGuard,
    AdminAuthenticationGuard,
    AuthenticationService,
    DatePipe,
    NotificationService,
    EmployeeService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
