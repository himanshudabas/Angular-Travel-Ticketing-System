import {NgModule} from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {Error404Component} from './component/error404/error404.component';
import {HomeComponent} from './component/home/home.component';
import {UserDetailsComponent} from './component/user/registration/user-details.component';
import {ResetComponent} from './component/user/reset/reset.component';
import {LoginComponent} from './component/login/login.component';
import {CreateTicketComponent} from './component/user/ticket/create/create-ticket.component';
import {ViewTicketsComponent} from './component/user/ticket/view/view-tickets.component';
import {ViewTicketDetailsComponent} from './component/user/ticket/view-ticket-details/view-ticket-details.component';
import {AdminViewTicketsComponent} from './component/admin/admin-view-tickets/admin-view-tickets.component';
import {AdminViewTicketDetailsComponent} from './component/admin/admin-view-ticket-details/admin-view-ticket-details.component';
import {UserAuthenticationGuard} from './guard/user-authentication-guard.service';
import {AdminAuthenticationGuard} from './guard/admin-authentication.guard';
import {LoggedInAuthenticationGuard} from './guard/logged-in-authentication.guard';

const routes: Routes = [

  // GUEST ROUTES
  { path: 'login', component: LoginComponent, canActivate: [LoggedInAuthenticationGuard]},
  { path: 'register', component: UserDetailsComponent, canActivate: [LoggedInAuthenticationGuard]},
  { path: 'admin/login', component: LoginComponent, canActivate: [LoggedInAuthenticationGuard]},
  { path: 'resetPassword', component: ResetComponent, canActivate: [LoggedInAuthenticationGuard]},

  // USER ROUTES
  { path: '', redirectTo: 'login', pathMatch: 'full'},
  { path: 'home', component: HomeComponent, canActivate: [UserAuthenticationGuard]},
  { path: 'tickets/create', component: CreateTicketComponent, canActivate: [UserAuthenticationGuard]},
  { path: 'tickets', component: ViewTicketsComponent, canActivate: [UserAuthenticationGuard]},
  { path: 'tickets/:ticketId', component: ViewTicketDetailsComponent, canActivate: [UserAuthenticationGuard]},
  { path: 'tickets/edit/:ticketId', component: CreateTicketComponent, canActivate: [UserAuthenticationGuard]},
  { path: 'user/edit', component: UserDetailsComponent, canActivate: [UserAuthenticationGuard]},

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
