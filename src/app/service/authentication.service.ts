import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {Employee} from '../model/Employee';
import {JwtHelperService} from '@auth0/angular-jwt';
import {EmployeeLoginDto} from '../model/employee-login.dto';
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

  public saveTokenAndEmployee(response: HttpResponse<Employee>): void {
    const token = response.headers.get(HeaderType.JWT_TOKEN);
    this.saveToken(token);
    this.addEmployeeToLocalCache(response.body);
  }

  public login(employeeLoginDto: EmployeeLoginDto): Observable<HttpResponse<Employee>> {
    return this.http.post<Employee>(`${this.host}/employee/login`, employeeLoginDto, {observe: 'response'});
  }

  public register(employee: Employee): Observable<HttpResponse<Employee>> {
    // this is required because currently we assume that username = email
    employee.username = employee.email;
    return this.http.post<Employee>(`${this.host}/employee/register`, employee, {observe: 'response'});
  }

  public logOut(): void {
    this.token = null;
    this.loggedInUsername = null;
    localStorage.removeItem('employee');
    localStorage.removeItem('token');
    localStorage.removeItem('employees');
  }

  public saveToken(token: string): void {
    this.token = token;
    localStorage.setItem('token', token);
  }

  public addEmployeeToLocalCache(employee: Employee): void {
    localStorage.setItem('employee', JSON.stringify(employee));
  }

  public getEmployeeFromLocalCache(): Employee {
    return JSON.parse(localStorage.getItem('employee'));
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

  public isEmployeeLoggedIn(): boolean {
    return this.isLoggedIn() && !this.getEmployeeFromLocalCache().isAdmin;
  }

  public isAdminLoggedIn(): boolean {
    return this.isLoggedIn() && this.getEmployeeFromLocalCache().isAdmin;
  }


}
