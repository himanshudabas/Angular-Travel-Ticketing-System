import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Employee} from '../model/Employee';
import {CustomHttpResponse} from '../model/custom-http-response';
import {AuthenticationService} from './authentication.service';


@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private host = environment.apiUrl;


  constructor(
    private http: HttpClient,
    private authenticationService: AuthenticationService,
  ) {
  }

  public updateEmployee(employee: Employee): Observable<Employee> {
    return this.http.post<Employee>(`${this.host}/employee/update/${employee.email}`, employee);
  }

  public resetPassword(email: string): Observable<CustomHttpResponse> {
    return this.http.get<CustomHttpResponse>(`${this.host}/employee/resetPassword/${email}`);
  }

  public getEmployee(): Observable<Employee> {
    const employee = this.authenticationService.getEmployeeFromLocalCache();
    return this.http.get<Employee>(`${this.host}/employee/${employee.username}`);
  }

  public getAllEmployees(): Observable<Record<number, Employee>> {
    return this.http.get<Record<number, Employee>>(`${this.host}/employee/allEmployees`);
  }

  // todo: maybe put FormGroup here instead of FormData
  public createEmployeeFormData(loggedInUsername: string, employee: Employee): any {
    const formData = new FormData();
  }

}
