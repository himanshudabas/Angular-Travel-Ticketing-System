import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {User} from '../model/User';
import {JwtHelperService} from '@auth0/angular-jwt';
import {UserLoginDto} from '../model/user-login.dto';
import {HeaderType} from '../enum/header-type.enum';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  public host = environment.apiUrl;
  private token: string;
  private loggedInUsername: string;
  private jwtHelper = new JwtHelperService();
  private loginEventData = new BehaviorSubject('');
  data$ = this.loginEventData.asObservable();

  public changeData(data: string): void {
    this.loginEventData.next(data);
  }

  constructor(
    private http: HttpClient,
  ) { }

  public saveTokenAndUser(response: HttpResponse<User>): void {
    const token = response.headers.get(HeaderType.JWT_TOKEN);
    this.saveToken(token);
    this.addUserToLocalCache(response.body);
  }

  public login(userLoginDto: UserLoginDto): Observable<HttpResponse<User>> {
    return this.http.post<User>(`${this.host}/user/login`, userLoginDto, {observe: 'response'});
  }

  public register(user: User): Observable<HttpResponse<User>> {
    // this is required because currently we assume that username = email
    user.username = user.email;
    return this.http.post<User>(`${this.host}/user/register`, user, {observe: 'response'});
  }

  public logOut(): void {
    this.token = null;
    this.loggedInUsername = null;
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('users');
  }

  public saveToken(token: string): void {
    this.token = token;
    localStorage.setItem('token', token);
  }

  public addUserToLocalCache(user: User): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  public getUserFromLocalCache(): User {
    return JSON.parse(localStorage.getItem('user'));
  }

  public loadToken(): void {
    this.token = localStorage.getItem('token');
  }

  public getToken(): string {
    return this.token;
  }

  public isLoggedIn(): boolean {
    this.loadToken();
    if (this.token != null && this.token !== '') {
      if (this.jwtHelper.decodeToken(this.token).sub != null || '' ) {
        if (!this.jwtHelper.isTokenExpired(this.token)) {
          this.loggedInUsername = this.jwtHelper.decodeToken(this.token).sub;
          return true;
        }
      }
    }
    this.logOut();
    return false;
  }

  public isUserLoggedIn(): boolean {
    return this.isLoggedIn() && !this.getUserFromLocalCache().isAdmin;
  }

  public isAdminLoggedIn(): boolean {
    return this.isLoggedIn() && this.getUserFromLocalCache().isAdmin;
  }


}
