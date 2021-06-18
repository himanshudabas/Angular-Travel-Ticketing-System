import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HomeComponent} from './component/home/home.component';
import {ReactiveFormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {UserService} from './service/user.service';
import {UserAuthenticationGuard} from './guard/user-authentication-guard.service';
import {ResetComponent} from './component/user/reset/reset.component';
import {NotificationModule} from './notification.module';
import {AuthInterceptor} from './interceptor/auth.interceptor';
import {LoginComponent} from './component/login/login.component';
import {NotificationService} from './service/notification.service';
import {UserDetailsComponent} from './component/user/registration/user-details.component';
import {UserFormComponent} from './component/user/registration/user-form/user-form.component';
import {ConfirmationComponent} from './component/user/registration/confirmation/confirmation.component';
import {Error404Component} from './component/error404/error404.component';
import {AuthenticationService} from './service/authentication.service';
import {ChartsModule} from 'ng2-charts';
import {DatePipe} from '@angular/common';
import {AutocompleteLibModule} from 'angular-ng-autocomplete';
import { CreateTicketComponent } from './component/user/ticket/create/create-ticket.component';
import {MaterialModule} from './material.module';
import {MatInputModule} from '@angular/material/input';
import {TicketConfirmationComponent} from './component/user/ticket/create/confirmation/ticket-confirmation.component';
import {ViewTicketsComponent} from './component/user/ticket/view/view-tickets.component';
import {MatPaginatorModule} from '@angular/material/paginator';
import { ViewTicketDetailsComponent } from './component/user/ticket/view-ticket-details/view-ticket-details.component';
import { AdminViewTicketsComponent } from './component/admin/admin-view-tickets/admin-view-tickets.component';
import { AdminViewTicketDetailsComponent } from './component/admin/admin-view-ticket-details/admin-view-ticket-details.component';
import {FileUploadComponent} from './component/utility/file-upload.component';
import {MatSelectModule} from '@angular/material/select';
import {AdminAuthenticationGuard} from './guard/admin-authentication.guard';
import {MatAutocompleteModule} from '@angular/material/autocomplete';

@NgModule({
  declarations: [
    AppComponent,
    FileUploadComponent,
    LoginComponent,
    TicketConfirmationComponent,
    UserFormComponent,
    HomeComponent,
    ResetComponent,
    UserDetailsComponent,
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
    UserAuthenticationGuard,
    AdminAuthenticationGuard,
    AuthenticationService,
    DatePipe,
    NotificationService,
    UserService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
