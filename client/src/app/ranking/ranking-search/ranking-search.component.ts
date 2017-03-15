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
  
  team: Team;
  sprint: Sprint;

  constructor(private teamService: TeamService, private sprintService: SprintService, private rankingService: RankingService) {
    this._setUpBoard();
  }

  _setUpBoard() {
    let arrPromises = [this._loadTeams(), this._loadSprints()];

    Promise.all(arrPromises)
      .then(() => {
        this.sprintService.findlast().subscribe((sprint) => {
        });
      })
  }

  _loadTeams(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.teamService.list()
      .then(teams => {
        this.teams = teams;
        resolve();
      })
      .catch(error => {
        reject(error);
      });
    });
    
  }

  _loadSprints(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.sprintService.all()
      .then(sprints => {
        sprints.forEach((sprint) => {
          if(new Date(sprint.dateFinish).getTime() < new Date().getTime()){
            this.sprints.push(sprint);
          }
        });
        resolve();
      })
      .catch(error => {
        reject(error);
      });
    });
    
  }

  loadRanking(): void {
    if(this.sprint && this.team){
      this.rankingService.getMainRanking(this.sprint, this.team)
        .then((ranking) => this.rankings = ranking)
        .catch((err) => console.log(err));
    }
  }

  ngOnInit() {
  }

}
