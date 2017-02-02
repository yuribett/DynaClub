import { AppService } from '../../app.service';
import { Team } from '../../teams/team';
import { UserService } from '../../user/user.service';
import { Globals } from '../../app.globals';
import { User } from '../../user/user';
import { Component, OnInit, Directive, Output, EventEmitter, Input, SimpleChange } from '@angular/core';

@Component({
  selector: 'app-donate',
  templateUrl: './donate.component.html',
  styleUrls: ['./donate.component.css']
})
export class DonateComponent implements OnInit {

  teamUsers: Array<User>;
  selectedUser: User;
  userService: UserService;
  appService: AppService;

  constructor(userService: UserService, appService: AppService) {
    this.userService = userService;
    this.appService = appService;
    let _currentTeam: Team = JSON.parse(localStorage.getItem(Globals.CURRENT_TEAM));
    this.loadUsers(_currentTeam);
  }

  ngOnInit() {
    this.appService.getCurrentTeam().subscribe((team: Team) => {
      this.loadUsers(team);
    });
  }

  loadUsers(team: Team) {
    this.teamUsers = null;
    this.userService.findByTeam(team).subscribe(users => {
      this.teamUsers = users.filter(user => this.userService.getStoredUser()._id != user._id);
    });
  }

}