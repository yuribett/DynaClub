import { OnDestroy, Component, OnInit, Input } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { AppService } from '../app.service';
import { User } from '../shared/models/user';
import { UserService } from '../shared/services/user.service';
import { Globals } from '../app.globals';
import { Team } from '../shared/models/team';
import { Subscription } from 'rxjs/Subscription';

@Component({
	selector: 'app-menu',
	templateUrl: './menu.component.html',
	styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit, OnDestroy {

	user: User = new User();
	currentTeam: Team;
	_subCurrentTeam: Subscription;

	constructor(private auth: AuthService, private appService: AppService, private userService: UserService) {
		var _self = this;
		if (this.auth.isLoggedIn()) {
			this.user = userService.getStoredUser();
			//getting remote to double check admin permitions
			userService.findById(userService.getStoredUser()._id).subscribe(user => {
				_self.user = user
			});
			this.currentTeam = JSON.parse(this.appService.getStorage().getItem(Globals.CURRENT_TEAM));
		}
	}

	ngOnInit(): any {
		let _self = this;
		this.appService.getUser().subscribe((loggedUser: User) => {
			_self.user = loggedUser;
		});
		this._subCurrentTeam = this.appService.getCurrentTeam().subscribe((team: Team) => {
			_self.currentTeam = team;
		});
	}

	ngOnDestroy() {
		this._subCurrentTeam.unsubscribe();
	}

	logout(e) {
		e.preventDefault();
		this.appService.clearStorage();
		this.auth.logout();
	}

	changeTeam(e, team: Team) {
		e.preventDefault();
		this.appService.setCurrentTeam(team);
		this.appService.getStorage().removeItem(Globals.CURRENT_TEAM);
		this.appService.getStorage().setItem(Globals.CURRENT_TEAM, JSON.stringify(team));
	}

}
