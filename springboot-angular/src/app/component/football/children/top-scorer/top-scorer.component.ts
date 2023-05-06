import { Component, OnInit } from '@angular/core';
import { Scorers } from 'src/app/model/football/scorers';
import { FootballService } from 'src/app/service/football.service';

@Component({
  selector: 'app-top-scorer',
  templateUrl: './top-scorer.component.html',
  styleUrls: ['./top-scorer.component.css']
})
export class TopScorerComponent implements OnInit {

  scorers: Scorers;

  constructor(private footballService: FootballService) { }

  ngOnInit(): void {
    this.footballService.getPremierLeagueTopScorers()
      .subscribe(response => {
        this.scorers = response;
      })
  }

}
