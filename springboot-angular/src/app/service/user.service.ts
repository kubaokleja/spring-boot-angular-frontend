import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CustomHttpResponse } from '../model/custom-http-response';
import { Page } from '../model/page';
import { User } from '../model/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private host = environment.apiUrl;

  constructor(private http: HttpClient) { }

  public getUsers(keyword: string = '', page?: number, size?: number): Observable<Page | HttpErrorResponse> {  
    return this.http.get<Page | HttpErrorResponse>(`${this.host}/user/list?keyword=${keyword}&page=${page}&size=${size}`);
  }

  public getUserById(userId: string): Observable<User | HttpErrorResponse> {
    return this.http.get<User | HttpErrorResponse>(`${this.host}/user/${userId}`);
  }

  public updateUser(user: User, userId: string):  Observable<User | HttpErrorResponse>{
    return this.http.post<User | HttpErrorResponse>
      (`${this.host}/user/${userId}`, user);
  }

  public deleteUser(userId: string): Observable<CustomHttpResponse> {
    return this.http.delete<CustomHttpResponse>(`${this.host}/user/${userId}`);
  }

  public createUserByAdmin(user: User):  Observable<User | HttpErrorResponse>{
    return this.http.post<User | HttpErrorResponse>
      (`${this.host}/user/create`, user);
  }

  public updateUserByAdmin(user: User):  Observable<User | HttpErrorResponse>{
    return this.http.post<User | HttpErrorResponse>
      (`${this.host}/user/update`, user);
  }

  public deleteUserByAdmin(userId: string): Observable<CustomHttpResponse> {
    return this.http.delete<CustomHttpResponse>(`${this.host}/user/delete/${userId}`);
  }

  public confirmRegistration(token: string): Observable<string | HttpErrorResponse> {
    let params = {token: token};
    return this.http.get(`${this.host}/user/register/confirm`, {params: params, responseType: 'text'});
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
