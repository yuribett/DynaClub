import { ValidatorFn, Validators, FormBuilder, FormGroup } from '@angular/forms';
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
	formErrors = {
		'amount': '',
		'user': '',
		'type': '',
		'message': ''
	};

	validationMessages = {
		'amount': {
			'required': 'Quanto voc&ecirc; quer doar?',
			'funds': 'Saldo insuficiente.',
			'min': 'Doe pelo menos uma Dyna. S&oacute; umazinha!.'
		},
		'user': {
			'required': 'Pra quem voc&ecedil; quer doar?.'
		},
		'type': {
			'required': 'Nenhum motivo em especial?.'
		},
		'message': {
			'required': 'Deixe uma mensagem para a pessoa.',
			'minlength': 'A mensagem deve conter no m&iacute;nimo 3 caracteres.',
			'maxlength': 'A mensagem deve conter no m&aacute;ximo 500 caracteres.',
		}
	};

	constructor(private userService: UserService, private appService: AppService, private transactionService: TransactionService, private transactionTypeService: TransactionTypeService, private sprintService: SprintService, private toastService: NotificationsService,
		private formBuilder: FormBuilder) {
		let _currentTeam: Team = JSON.parse(this.appService.getStorage().getItem(Globals.CURRENT_TEAM));
		this.transactionTypeService.find().subscribe(types => {
			this.transactionTypes = types;
		});
		this.loadUsers(_currentTeam);


	}

	ngOnInit() {
		this.appService.getCurrentTeam().subscribe((team: Team) => {
			this.loadUsers(team);
			this.transaction = new Transaction();
		});
		this.buildForm();
	}

	decodeMsg(string: string) {
		let decoder: HTMLElement = document.createElement("div");
		decoder.innerHTML = string;
		return decoder.innerHTML;
	}

	buildForm(): void {
		this.donateForm = this.formBuilder.group({
			'amount': [null, Validators.required],
			'user': [null, Validators.required],
			'type': [null, Validators.required],
			'message': [null, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(500)])]
		});

		this.donateForm.valueChanges
			.subscribe(data => this.onValueChanged(data));

		this.onValueChanged(); // (re)set validation messages now
	}


	onValueChanged(data?: any) {
		if (!this.donateForm) { return; }
		for (const field in this.formErrors) {
			// clear previous error message (if any)
			this.formErrors[field] = '';
			const control = this.donateForm.get(field);
			if (control && control.dirty && !control.valid) {
				const messages = this.validationMessages[field];
				for (const key in control.errors) {
					this.formErrors[field] += this.decodeMsg(messages[key]) + ' ';
				}
			}
		}
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