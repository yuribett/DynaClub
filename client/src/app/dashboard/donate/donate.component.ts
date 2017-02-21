import { Validators, FormBuilder, FormGroup } from '@angular/forms';
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
	styleUrls: ['./donate.component.scss'],
	animations: [slide]
})
export class DonateComponent implements OnInit {

	teamUsers: Array<User>;
	transactionTypes: Array<TransactionType>;
	buttonsState: String = 'center';
	formState: String = 'right';
	transaction: Transaction = new Transaction();
	donateForm: FormGroup;
	public toastOptions = {
		timeOut: 8000,
		lastOnBottom: true,
		clickToClose: true,
		maxLength: 0,
		maxStack: 7,
		showProgressBar: true,
		pauseOnHover: true,
		preventDuplicates: true,
		rtl: false,
		animate: 'fromLeft',
		position: ['right', 'top']
	};

	constructor(private userService: UserService, private appService: AppService, private transactionService: TransactionService, private transactionTypeService: TransactionTypeService, private sprintService: SprintService, private toastService: NotificationsService, formBuilder: FormBuilder) {
		let _currentTeam: Team = JSON.parse(this.appService.getStorage().getItem(Globals.CURRENT_TEAM));
		this.transactionTypeService.find().subscribe(types => {
			this.transactionTypes = types;
		});
		this.loadUsers(_currentTeam);

		this.donateForm = formBuilder.group({
			'amount': [null, Validators.required],
			'user': [null, Validators.required],
			'type': [null, Validators.required],
			'message': [null, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(500)])]
		});
	}

	ngOnInit() {
		this.appService.getCurrentTeam().subscribe((team: Team) => {
			this.loadUsers(team);
			this.transaction = new Transaction();
		});
	}

	toggleMenu() {
		this.donateForm.reset();
		this.buttonsState = this.buttonsState === 'left' ? 'center' : 'left';
		this.formState = this.formState === 'right' ? 'center' : 'right';
	}

	loadUsers(team: Team) {
		this.teamUsers = null;
		this.userService.findByTeam(team).subscribe(users => {
			this.teamUsers = users.filter(user => this.userService.getStoredUser()._id != user._id);
		});
	}

	cancel() {
		this.toastService.remove();
		this.transaction = new Transaction();
		this.toggleMenu();
	}

	donate() {
		this.toastService.remove();
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