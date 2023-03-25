import { HttpClient, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CustomHttpResponse } from '../model/custom-http-response';
import { UploadUserDetails } from '../model/upload-user-details';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  private host = environment.apiUrl;

  constructor(private http: HttpClient) { }

  downloadUserUploadTemplate(): Observable<HttpEvent<Blob>> {
    return this.http.get(`${this.host}/files/template/users-template.csv`, {
      observe: 'events',
      responseType: 'blob',
      reportProgress: true
    })
  }

  //upload files
  uploadUsers(formData: FormData): Observable<UploadUserDetails[]> {
    return this.http.post<UploadUserDetails[]>(`${this.host}/user-management/upload`, formData);
  }
}
