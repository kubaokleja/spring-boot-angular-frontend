import { HttpClient, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  private host = environment.apiUrl;

  constructor(private http: HttpClient) { }

  downloadUserUploadTemplate(): Observable<HttpEvent<Blob>> {
    return this.http.get(`${this.host}/file/template/users-template.csv`, {
      observe: 'events',
      responseType: 'blob'
    })
  }

}
