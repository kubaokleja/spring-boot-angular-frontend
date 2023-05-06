import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Scorers } from '../model/football/scorers';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FootballService {

  private host = environment.apiUrl;

  constructor(private http: HttpClient) { }
  
  public getPremierLeagueTopScorers(): Observable<Scorers> {  
    return this.http.get<Scorers>(`${this.host}/football/scorers/PL`);
  }
}
