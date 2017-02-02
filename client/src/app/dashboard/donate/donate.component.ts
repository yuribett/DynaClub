import { AppService } from '../../app.service';
import { Team } from '../../teams/team';
import { UserService } from '../../user/user.service';
import { Globals } from '../../app.globals';
import { User } from '../../user/user';
import { slideIn, slideOut } from '../../animations';
import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-donate',
	templateUrl: './donate.component.html',
	styleUrls: ['./donate.component.css'],
	animations: [slideIn, slideOut]
})
export class DonateComponent implements OnInit {

	teamUsers: Array<User>;
	selectedUser: User;
	userService: UserService;
	appService: AppService;
	buttonsState: String = 'visible';
	formState: String = 'hidden'

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

	toggleMenu() {
		this.buttonsState = this.buttonsState === 'hidden' ? 'visible' : 'hidden';
		this.formState = this.formState === 'hidden' ? 'visible' : 'hidden';
	}

	loadUsers(team: Team) {
		this.teamUsers = null;
		this.userService.findByTeam(team).subscribe(users => {
			this.teamUsers = users.filter(user => this.userService.getStoredUser()._id != user._id);
		});
	}

}