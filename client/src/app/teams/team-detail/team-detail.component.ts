import { Component, OnInit, Input, ViewChildren } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { TeamService } from '../team.service';
import { Team } from '../team';

@Component({
  selector: 'app-team-detail',
  templateUrl: './team-detail.component.html',
  styleUrls: ['./team-detail.component.css']
})
export class TeamDetailComponent implements OnInit {

  @Input() team: Team;
  error: any;
  @ViewChildren('inputName') inputName;

  constructor(
    private teamService: TeamService,
    private route: ActivatedRoute) {}

  ngAfterViewInit() {            
    this.inputName.first.nativeElement.focus();
  }

  ngOnInit(): void {
    this.route.params.forEach((params: Params) => {
      if (params['id'] !== undefined) {
        let id = params['id'];
        this.teamService.findById(id)
            .then(team => this.team = team);
      } else {
        this.team = new Team();
        this.team.active = true;
      }
    });
  }
  
  save(): void {
    this.teamService
        .save(this.team)
        .then(team => this.team = team)
        .catch(error  => this.error = error);
  }

  goBack(): void {
    window.history.back();
  }

}
