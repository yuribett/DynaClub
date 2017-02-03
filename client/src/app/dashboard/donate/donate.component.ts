import { Transaction } from '../transaction/transaction';
import { AppService } from '../../app.service';
import { Team } from '../../teams/team';
import { UserService } from '../../user/user.service';
import { Globals } from '../../app.globals';
import { User } from '../../user/user';
import { slideLeft, slideRight } from '../../animations';
import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-donate',
	templateUrl: './donate.component.html',
	styleUrls: ['./donate.component.css'],
	animations: [slideLeft, slideRight]
})
export class DonateComponent implements OnInit {

	teamUsers: Array<User>;
	userService: UserService;
	appService: AppService;
	buttonsState: String = 'visible';
	formState: String = 'hidden';
	transaction: Transaction = new Transaction();;
	
	constructor(userService: UserService, appService: AppService) {
		this.userService = userService;
		this.appService = appService;
		let _currentTeam: Team = JSON.parse(this.appService.getStorage().getItem(Globals.CURRENT_TEAM));
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

	donate() {
		this.transaction.from = this.userService.getStoredUser();
		this.transaction.date = new Date();
		this.transaction.team = JSON.parse(localStorage.getItem(Globals.CURRENT_TEAM));//Mudar com as alteracoes do Yuri
		console.log('Enviando transaction: ', this.transaction);
		this.transaction = new Transaction();
	}

}