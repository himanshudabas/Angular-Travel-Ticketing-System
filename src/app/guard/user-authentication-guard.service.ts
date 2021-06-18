import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {AuthenticationService} from '../service/authentication.service';
import {NotifierService} from 'angular-notifier';
import {NotificationType} from '../enum/notification-type.enum';

@Injectable({
  providedIn: 'root'
})
export class UserAuthenticationGuard implements CanActivate {

  constructor(
    private authenticationService: AuthenticationService,
    private route: Router,
    private notifierService: NotifierService,
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    return this.isUserLoggedIn();
  }

  private isUserLoggedIn(): boolean {
    if (this.authenticationService.isUserLoggedIn()) {
      return true;
    }
    if (this.authenticationService.isAdminLoggedIn()) {
      this.route.navigate(['/admin/tickets']);
      return false;
    }
    this.notifierService.notify(NotificationType.ERROR, `You need to Login to access this page`);
    this.route.navigate(['/login']);
    return false;
  }
}
