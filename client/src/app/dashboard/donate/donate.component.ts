import { TeamService } from '../../shared/services/team.service';
import { FormControl, AbstractControl, ValidatorFn, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { NotificationsService } from 'angular2-notifications';
import { Sprint } from '../../shared/models/sprint';
import { SprintService } from '../../shared/services/sprint.service';
import { TransactionService } from '../transaction/transaction.service';
import { TransactionType } from '../../shared/models/transaction-type';
import { TransactionTypeService } from '../../shared/services/transaction-type.service';
import { Transaction } from '../transaction/transaction';
import { AppService } from '../../app.service';
import { Team } from '../../shared/models/team';
import { Wallet } from '../../shared/models/wallet';
import { UserService } from '../../shared/services/user.service';
import { Globals } from '../../app.globals';
import { User } from '../../shared/models/user';
import { slide } from '../../animations';
import { OnDestroy, Input, Component, OnInit } from '@angular/core';
import { TransactionErrors } from '../../shared/errors/transaction.errors';
import { Subscription } from 'rxjs/Subscription';
declare var $: any;

@Component({
	selector: 'app-donate',
	templateUrl: './donate.component.html',
	styleUrls: ['./donate.component.less'],
	animations: [slide]
})
export class DonateComponent implements OnInit, OnDestroy {

	teamUsers: Array<User>;
	transactionTypes: Array<TransactionType>;
	buttonsState: String = 'center';
	formState: String = 'right';
	transaction: Transaction = new Transaction();
	donateForm: FormGroup;
	wallet: Wallet = new Wallet();
	_subCurrentTeam: Subscription;
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
			'max': 'Saldo insuficiente.',
			'gt': 'Doe pelo menos uma Dyna.'
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

	constructor(private userService: UserService, private appService: AppService, private teamService: TeamService, private transactionService: TransactionService, private transactionTypeService: TransactionTypeService, private sprintService: SprintService,
		private toastService: NotificationsService, private formBuilder: FormBuilder) {

		let _currentTeam: Team = teamService.getCurrentTeam();
		this.transactionTypeService.find().subscribe(types => {
			this.transactionTypes = types;
		});
		this.loadUsers(_currentTeam);
	}

	ngOnInit() {
		this._subCurrentTeam = this.appService.getCurrentTeam().subscribe((team: Team) => {
			this.loadUsers(team);
			this.donateForm.reset();
			this.getWallet(team);
			this.transaction = new Transaction();
		});
		this.buildForm();
		this.getWallet();
	}

	ngOnDestroy() {
		this._subCurrentTeam.unsubscribe();
	}

	getWallet(team: Team = this.teamService.getCurrentTeam()) {
		this.transactionService.getWallet(this.userService.getStoredUser(), team).subscribe(
			wallet => {
				this.wallet = wallet;
				this.donateForm.controls['amount'].setValidators([Validators.required, CustomValidators.max(this.wallet.funds), CustomValidators.gt(0)]);
				this.donateForm.controls['amount'].updateValueAndValidity();
			}
		);
	}

	buildForm() {
		this.donateForm = this.formBuilder.group({
			'amount': new FormControl('', [Validators.required, CustomValidators.max(1000), CustomValidators.gt(0)]),
			'user': new FormControl('', Validators.required),
			'type': new FormControl('', Validators.required),
			'message': new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(500)])
		});

		this.donateForm.valueChanges.subscribe(data => this.onValueChanged(data));
		this.onValueChanged(); // (re)set validation messages now
	}

	getControlClass(control: string): string {
		if (this.donateForm.controls[control].pristine) {
			return "";
		}
		return this.donateForm.controls[control].valid ? "has-success" : "has-error";
	}

	decodeMsg(string: string) {
		let decoder: HTMLElement = document.createElement("div");
		decoder.innerHTML = string;
		return decoder.innerHTML;
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
		$('#donateBtn').button('loading');
		this.toastService.remove();
		this.transaction.from = this.userService.getStoredUser();
		this.transaction.date = new Date();
		this.transaction.team = JSON.parse(this.appService.getStorage().getItem(Globals.CURRENT_TEAM));
		this.transactionService.insert(this.transaction).subscribe(
			transaction => {
				this.transaction = new Transaction();
				this.toggleMenu();
				this.getWallet();
				$('#donateBtn').button('reset');
			},
			error => {
				TransactionErrors.parseServerErrors(error).subscribe(
					content => {
						this.toastService.error('Error', content.msg, content.ref);
					},
					error => console.log(error)
				);
				$('#donateBtn').button('reset');
			}
		);
	}

}