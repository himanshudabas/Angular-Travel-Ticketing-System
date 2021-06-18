import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {User} from '../model/User';
import {CustomHttpResponse} from '../model/custom-http-response';
import {AuthenticationService} from './authentication.service';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  private host = environment.apiUrl;


  constructor(
    private http: HttpClient,
    private authenticationService: AuthenticationService,
  ) {
  }

  public updateUser(user: User): Observable<User> {
    return this.http.post<User>(`${this.host}/user/update/${user.email}`, user);
  }

  public resetPassword(email: string): Observable<CustomHttpResponse> {
    return this.http.get<CustomHttpResponse>(`${this.host}/user/resetPassword/${email}`);
  }

  public getUser(): Observable<User> {
    const user = this.authenticationService.getUserFromLocalCache();
    return this.http.get<User>(`${this.host}/user/${user.username}`);
  }

  public getAllUsers(): Observable<Record<number, User>> {
    return this.http.get<Record<number, User>>(`${this.host}/user/allUsers`);
  }

  // todo: maybe put FormGroup here instead of FormData
  public createUserFormData(loggedInUsername: string, user: User): any {
    const formData = new FormData();

  }

}
