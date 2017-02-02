import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { AppService } from '../app.service';
import { User } from '../user/user';
import { UserService } from '../user/user.service';
import { Globals } from '../app.globals';
import { Team } from '../teams/team';

@Component({
	selector: 'app-menu',
	templateUrl: './menu.component.html',
	styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

	user: User = new User();
	currentTeam: Team;

	constructor(private auth: AuthService, private appService: AppService, private userService: UserService) {
		var _self = this;
		if (this.auth.isLoggedIn()) {
			this.user = userService.getStoredUser();
			//getting remote to double check admin permitions
			userService.findById(userService.getStoredUser()._id).subscribe(user => {
				_self.user = user
			});
			this.currentTeam = JSON.parse(localStorage.getItem(Globals.CURRENT_TEAM));
		}
	}

	ngOnInit(): any {
		let _self = this;
		this.appService.getUser().subscribe((loggedUser: User) => {
			_self.user = loggedUser;
		});
		this.appService.getCurrentTeam().subscribe((team: Team) => {
			_self.currentTeam = team;
		});
	}

	logout(e) {
		e.preventDefault();
		this.auth.logout();
	}

	changeTeam(e, team: Team) {
		e.preventDefault();
		this.appService.setCurrentTeam(team);
		localStorage.removeItem(Globals.CURRENT_TEAM);
		localStorage.setItem(Globals.CURRENT_TEAM, JSON.stringify(team));
	}

}
