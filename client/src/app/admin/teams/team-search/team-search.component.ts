
import { Team } from '../../../shared/models/team'
import { TeamService } from '../../../shared/services/team.service'
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'team-search',
  templateUrl: './team-search.component.html',
  styleUrls: ['./team-search.component.css']
})
export class TeamSearchComponent implements OnInit {

  @ViewChild('modal')
  teams: Team[];
  error: any;

  constructor(private router:Router, private teamService: TeamService) {}

  ngOnInit() {
    this.loadTeams();
  }

  loadTeams(): void {
    this.teamService
        .list()
        .then(teams => this.teams = teams )
        .catch(error => this.error = error);
  }

  gotoNewTeam(): void {
    this.router.navigateByUrl('/team/new');
  }
  
  afterDelete(team): void {
    this.loadTeams();
  }
}
