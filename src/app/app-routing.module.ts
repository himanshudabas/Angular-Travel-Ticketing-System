import {NgModule} from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {Error404Component} from './component/error404/error404.component';
import {HomeComponent} from './component/home/home.component';
import {EmployeeDetailsComponent} from './component/employee/registration/employee-details.component';

import {LoginComponent} from './component/login/login.component';
import {AdminViewTicketsComponent} from './component/admin/admin-view-tickets/admin-view-tickets.component';
import {AdminViewTicketDetailsComponent} from './component/admin/admin-view-ticket-details/admin-view-ticket-details.component';
import {EmployeeAuthenticationGuard} from './guard/employee-authentication-guard.service';
import {AdminAuthenticationGuard} from './guard/admin-authentication.guard';
import {LoggedInAuthenticationGuard} from './guard/logged-in-authentication.guard';
import { ResetComponent } from './component/employee/reset/reset.component';
import { CreateTicketComponent } from './component/employee/ticket/create/create-ticket.component';
import { ViewTicketDetailsComponent } from './component/employee/ticket/view-ticket-details/view-ticket-details.component';
import { ViewTicketsComponent } from './component/employee/ticket/view/view-tickets.component';

const routes: Routes = [

  // GUEST ROUTES
  { path: 'login', component: LoginComponent, canActivate: [LoggedInAuthenticationGuard]},
  { path: 'register', component: EmployeeDetailsComponent, canActivate: [LoggedInAuthenticationGuard]},
  { path: 'admin/login', component: LoginComponent, canActivate: [LoggedInAuthenticationGuard]},
  { path: 'resetPassword', component: ResetComponent, canActivate: [LoggedInAuthenticationGuard]},

  // EMPLOYEE ROUTES
  { path: '', redirectTo: 'login', pathMatch: 'full'},
  { path: 'home', component: HomeComponent, canActivate: [EmployeeAuthenticationGuard]},
  { path: 'tickets/create', component: CreateTicketComponent, canActivate: [EmployeeAuthenticationGuard]},
  { path: 'tickets', component: ViewTicketsComponent, canActivate: [EmployeeAuthenticationGuard]},
  { path: 'tickets/:ticketId', component: ViewTicketDetailsComponent, canActivate: [EmployeeAuthenticationGuard]},
  { path: 'tickets/edit/:ticketId', component: CreateTicketComponent, canActivate: [EmployeeAuthenticationGuard]},
  { path: 'employee/edit', component: EmployeeDetailsComponent, canActivate: [EmployeeAuthenticationGuard]},

  // ADMIN ROUTES
  { path: 'admin/tickets', component: AdminViewTicketsComponent, canActivate: [AdminAuthenticationGuard]},
  { path: 'admin/tickets/:ticketId', component: AdminViewTicketDetailsComponent, canActivate: [AdminAuthenticationGuard]},

  // ERROR ROUTE
  { path: '**', component: Error404Component},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
