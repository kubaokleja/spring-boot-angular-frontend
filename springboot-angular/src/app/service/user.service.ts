import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CustomHttpResponse } from '../model/custom-http-response';
import { Page } from '../model/page';
import { User } from '../model/user/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private host = environment.apiUrl;

  constructor(private http: HttpClient) { }

  public getUsers(keyword: string = '', page?: number, size?: number): Observable<Page | HttpErrorResponse> {  
    return this.http.get<Page | HttpErrorResponse>(`${this.host}/user-management?keyword=${keyword}&page=${page}&size=${size}`);
  }

  public getUserById(userId: string): Observable<User | HttpErrorResponse> {
    return this.http.get<User | HttpErrorResponse>(`${this.host}/users/${userId}`);
  }

  public updateUser(user: User, userId: string):  Observable<User | HttpErrorResponse>{
    return this.http.put<User | HttpErrorResponse>
      (`${this.host}/users/${userId}`, user);
  }

  public deleteUser(userId: string): Observable<CustomHttpResponse> {
    return this.http.delete<CustomHttpResponse>(`${this.host}/users/${userId}`);
  }

  public createUserByAdmin(user: User):  Observable<User | HttpErrorResponse>{
    return this.http.post<User | HttpErrorResponse>
      (`${this.host}/user-management`, user);
  }

  public updateUserByAdmin(user: User):  Observable<User | HttpErrorResponse>{
    return this.http.put<User | HttpErrorResponse>
      (`${this.host}/user-management`, user);
  }

  public deleteUserByAdmin(userId: string): Observable<CustomHttpResponse> {
    return this.http.delete<CustomHttpResponse>(`${this.host}/user-management/${userId}`);
  }

  public confirmRegistration(token: string): Observable<string | HttpErrorResponse> {
    let params = {token: token};
    return this.http.get(`${this.host}/users/confirm`, {params: params, responseType: 'text'});
  }

  public resetPassword(email: string): Observable<CustomHttpResponse> {
    return this.http.post<CustomHttpResponse>(`${this.host}/users/reset-password/${email}`, {});
  }

  public changePassword(password: string) {
    return this.http.post<CustomHttpResponse>(`${this.host}/users/change-password/${password}`, {});
  }

  public createUserFormData( user: User): FormData {
    const formData = new FormData();
    formData.append('firstName', user.firstName);
    formData.append('lastName', user.lastName);
    formData.append('username', user.username);
    formData.append('email', user.email);
    formData.append('isActive', JSON.stringify(user.isActive));
    formData.append('isNonLocked', JSON.stringify(user.isNotLocked));
    return formData;
  }
}
