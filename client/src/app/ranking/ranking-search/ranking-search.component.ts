import { Component, OnInit } from '@angular/core';
import { TeamService } from '../../shared/services/team.service';
import { Team } from '../../shared/models/team';
import { SprintService } from '../../shared/services/sprint.service';
import { Sprint } from '../../shared/models/sprint';
import { Ranking } from '../ranking';
import { RankingService } from '../ranking.service';

@Component({
  selector: 'app-ranking-search',
  templateUrl: './ranking-search.component.html',
  styleUrls: ['./ranking-search.component.css']
})
export class RankingSearchComponent implements OnInit {

  teams: Team[] = [];
  sprints: Sprint[] = [];
  rankings: Ranking[] = [];
  teamDefault: Team;

  constructor(private teamService: TeamService, private sprintService: SprintService, private rankingService: RankingService) {
    this._loadTeams();
    this._loadSprints();
    this.sprintService.findlast().subscribe((sprint) => {
      this._loadRanking(sprint, this.teamService.getCurrentTeam());
    });
    this.teamDefault = teamService.getCurrentTeam();
  }

  _loadTeams(): void {
    this.teamService.list()
      .then(teams => this.teams = teams)
      .catch(error => console.log(error));
  }

  _loadSprints(): void {
    this.sprintService.all()
      .then(sprints => {
        sprints.forEach((sprint) => {
          if(new Date(sprint.dateFinish).getTime() < new Date().getTime()){
            this.sprints.push(sprint);
          }
        })
      })
      .catch(error => console.log(error));
  }

  _loadRanking(sprint: Sprint, team: Team): void {
    this.rankingService.getMainRanking(sprint, team)
      .then((ranking) => this.rankings = ranking)
      .catch((err) => console.log(err));
  }

  ngOnInit() {
  }

}
