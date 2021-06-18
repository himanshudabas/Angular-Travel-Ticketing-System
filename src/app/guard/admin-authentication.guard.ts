import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {AuthenticationService} from '../service/authentication.service';
import {NotifierService} from 'angular-notifier';
import {NotificationType} from '../enum/notification-type.enum';

@Injectable({
  providedIn: 'root'
})
export class AdminAuthenticationGuard implements CanActivate {

  constructor(
    private authenticationService: AuthenticationService,
    private route: Router,
    private notifierService: NotifierService,
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    return this.isAdminLoggedIn();
  }

  private isAdminLoggedIn(): boolean {
    if (this.authenticationService.isAdminLoggedIn()) {
      return true;
    }
    if (this.authenticationService.isEmployeeLoggedIn()) {
      this.route.navigate(['/home']);
      return false;
    }
    this.notifierService.notify(NotificationType.ERROR, `You need to login as admin to access this page`);
    this.route.navigate(['/admin/login']);
    return false;
  }
}
