import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {AuthenticationService} from '../service/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class LoggedInAuthenticationGuard implements CanActivate {

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    return this.isLoggedIn();
  }

  private isLoggedIn(): boolean {
    if (this.authenticationService.isEmployeeLoggedIn()) {
      this.router.navigate(['/home']);
      return false;
    }
    if (this.authenticationService.isAdminLoggedIn()) {
      this.router.navigate(['/admin/tickets']);
      return false;
    }
    return true;
  }
}
