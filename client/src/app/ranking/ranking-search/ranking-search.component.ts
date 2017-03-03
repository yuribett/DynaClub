import { Component, OnInit } from '@angular/core';
import { TeamService } from '../../shared/services/team.service';
import { Team } from '../../shared/models/team';
import { SprintService } from '../../shared/services/sprint.service';
import { Sprint } from '../../shared/models/sprint';
import { Ranking } from '../ranking';

@Component({
  selector: 'app-ranking-search',
  templateUrl: './ranking-search.component.html',
  styleUrls: ['./ranking-search.component.css']
})
export class RankingSearchComponent implements OnInit {

  teams: Team[] = [];
  sprints: Sprint[] = [];
  rankings: Ranking[] = [];

  constructor(private teamService: TeamService, private sprintService: SprintService) {
    this._loadTeams();
    this._loadSprints();
    this._loadRanking();
  }

  _loadTeams(): void {
    this.teamService.list()
      .then(teams => this.teams = teams)
      .catch(error => console.log(error));
  }

  _loadSprints(): void {
    this.sprintService.all()
      .then(sprints => this.sprints = sprints)
      .catch(error => console.log(error));
  }

  _loadRanking(): void {
    this.sprintService.all()
      .then(sprints => this.sprints = sprints)
      .catch(error => console.log(error));
  }

  ngOnInit() {
  }

}
