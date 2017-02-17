import { NotificationsService } from 'angular2-notifications';
import { Sprint } from '../../shared/models/sprint';
import { SprintService } from '../../shared/services/sprint.service';
import { TransactionService } from '../transaction/transaction.service';
import { TransactionType } from '../../shared/models/transaction-type';
import { TransactionTypeService } from '../../shared/services/transaction-type.service';
import { Transaction } from '../transaction/transaction';
import { AppService } from '../../app.service';
import { Team } from '../../shared/models/team';
import { UserService } from '../../shared/services/user.service';
import { Globals } from '../../app.globals';
import { User } from '../../shared/models/user';
import { slide } from '../../animations';
import { Component, OnInit } from '@angular/core';
import { TransactionErrors } from '../../shared/errors/transaction.errors';

@Component({
	selector: 'app-donate',
	templateUrl: './donate.component.html',
	styleUrls: ['./donate.component.css'],
	animations: [slide]
})
export class DonateComponent implements OnInit {

	teamUsers: Array<User>;
	transactionTypes: Array<TransactionType>;
	buttonsState: String = 'center';
	formState: String = 'right';
	transaction: Transaction = new Transaction();

	constructor(private userService: UserService, private appService: AppService, private transactionService: TransactionService,
		private transactionTypeService: TransactionTypeService, private sprintService: SprintService, private toastService: NotificationsService) {
		let _currentTeam: Team = JSON.parse(this.appService.getStorage().getItem(Globals.CURRENT_TEAM));
		this.transactionTypeService.find().subscribe(types => {
			this.transactionTypes = types;
		});
		this.loadUsers(_currentTeam);
	}

	ngOnInit() {
		this.appService.getCurrentTeam().subscribe((team: Team) => {
			this.loadUsers(team);
		});
	}

	toggleMenu() {
		this.buttonsState = this.buttonsState === 'left' ? 'center' : 'left';
		this.formState = this.formState === 'right' ? 'center' : 'right';
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
		this.transaction.team = JSON.parse(this.appService.getStorage().getItem(Globals.CURRENT_TEAM));
		this.transactionService.insert(this.transaction).subscribe(
			transaction => {
				this.transaction = new Transaction();
				this.toggleMenu();
			},
			error => {
				TransactionErrors.parseServerErrors(error).subscribe(
					content => {
						this.toastService.error('Error', content.msg, content.ref);
					},
					error => console.log(error)
				);
			});
	}

}