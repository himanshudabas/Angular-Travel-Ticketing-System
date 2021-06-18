import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import {AuthenticationService} from '../service/authentication.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authenticationService: AuthenticationService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (request.url.includes(`${this.authenticationService.host}/employee/login`) ||
        request.url.includes(`${this.authenticationService.host}/employee/register`) ||
        request.url.includes(`${this.authenticationService.host}/employee/resetPassword`)) {
      return next.handle(request);
    }
    this.authenticationService.loadToken();
    const token = this.authenticationService.getToken();
    const newRequest = request.clone({setHeaders: {Authorization: `Bearer ${token}`}});
    return next.handle(newRequest);
  }
}
