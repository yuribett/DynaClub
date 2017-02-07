import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TeamService } from '../team.service';
import { Team } from '../team';

@Component({
  selector: 'tr[team-search-item]',
  templateUrl: './team-search-item.component.html',
  styleUrls: ['./team-search-item.component.css']
})
export class TeamSearchItemComponent implements OnInit {

  @Input() team: Team;
  @Output() afterDelete: EventEmitter<Team> = new EventEmitter<Team>();
  edit = false;

  constructor(private teamService: TeamService) { }

  ngOnInit() {
  }

  onDelete(): void {
    this.teamService.delete(this.team).then(() => {
      this.afterDelete.emit(this.team);
    })
  }

}
