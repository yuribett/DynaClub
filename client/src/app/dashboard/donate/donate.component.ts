import { TeamService } from '../../shared/services/team.service';
import { TransactionStatus } from '../../shared/enums/transactionStatus';
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
import { OnDestroy, Input, Component, OnInit, ViewChild } from '@angular/core';
import { TransactionErrors } from '../../shared/errors/transaction.errors';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs';
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
	isDonating: boolean = true;
	toastOptions = {
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
	@ViewChild("donateBtn") donateBtn;
	formErrors = {
		'amount': '',
		'user': '',
		'type': '',
		'message': ''
	};
	donateMessages = {
		'amount': {
			'required': 'Quanto voc&ecirc; quer doar?',
			'max': 'Saldo insuficiente.',
			'gt': 'Doe pelo menos uma Dyna.',
			'lt': 'Valor limite para pedidos &eacute; D$1000.'
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
	requestMessages = {
		'amount': {
			'required': 'Quanto voc&ecirc; quer pedir?',
			'max': 'No m&aacute;ximo D$1000.',
			'gt': 'Pe&ccedil;a pelo menos uma Dyna.'
		},
		'user': {
			'required': 'Pra quem voc&ecedil; quer pedir?.'
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
			this.updateAmountValidators(team);
			this.transaction = new Transaction();
		});
		this.buildForm();
		this.transactionService.onTransactionsEdit().subscribe((transactionEdited: Transaction) => {
			this.updateAmountValidators();
		});
		this.transactionService.onTransactionsUpdated().subscribe((transactionUpdated: Transaction) => {
			this.updateAmountValidators();
		});
	}

	ngOnDestroy() {
		this._subCurrentTeam.unsubscribe();
	}

	async updateAmountValidators(team: Team = this.teamService.getCurrentTeam()) {
		if (this.isDonating) {
			this.wallet = await this.transactionService.getWallet(this.userService.getStoredUser(), team);
			this.donateForm.controls['amount'].setValidators([Validators.required, CustomValidators.max(this.wallet.funds), CustomValidators.gt(0)]);
		} else {
			this.donateForm.controls['amount'].setValidators([Validators.required, CustomValidators.max(1000), CustomValidators.gt(0)]);
		}
		this.donateForm.controls['amount'].updateValueAndValidity();
		this.donateBtn.nativeElement.disabled = this.donateForm.invalid;
	}

	buildForm() {
		this.donateForm = this.formBuilder.group({
			'amount': new FormControl('', [Validators.required, CustomValidators.lt(1), CustomValidators.gt(0)]),
			'user': new FormControl('', Validators.required),
			'type': new FormControl('', Validators.required),
			'message': new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(500)])
		});

		this.donateForm.valueChanges.subscribe(data => this.onValueChanged(data));
		this.onValueChanged(); // (re)set validation messages now
		this.updateAmountValidators();
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
				const messages = this.isDonating ? this.donateMessages[field] : this.requestMessages[field];
				for (const key in control.errors) {
					this.formErrors[field] += this.decodeMsg(messages[key]) + ' ';
				}
			}
		}
	}

	showForm(isDonating: boolean = true) {
		this.isDonating = isDonating;
		this.updateAmountValidators();
		this.buttonsState = 'left';
		this.formState = 'center';
		$('option:disabled').prop('selected', true);
	}

	showButtons() {
		this.buildForm();
		this.buttonsState = 'center';
		this.formState = 'right';
		this.unlockButton();
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
		this.showButtons();
	}

	lockButton() {
		this.donateBtn.nativeElement.disabled = true;
		this.donateBtn.nativeElement.innerText = 'Loading...';
	}

	unlockButton() {
		this.donateBtn.nativeElement.disabled = false;
		this.donateBtn.nativeElement.innerText = 'Enviar';
	}

	submit() {
		this.lockButton();
		this.toastService.remove();
		this.transaction.requester = this.userService.getStoredUser();
		this.transaction.team = this.teamService.getCurrentTeam();

		if (this.isDonating) {
			this.transaction.status = TransactionStatus.NORMAL;
			this.transaction.from = this.userService.getStoredUser();
		} else {
			this.transaction.status = TransactionStatus.PENDING;
			this.transaction.from = this.transaction.to;
			this.transaction.to = this.userService.getStoredUser();
		}

		let transactionOperation: Observable<Transaction> = !this.transaction._id ?
			this.transactionService.insert(this.transaction) :
			this.transactionService.update(this.transaction);

		transactionOperation.subscribe(
			transaction => {
				this.transaction = new Transaction();
				this.showButtons();
				this.updateAmountValidators();
				this.unlockButton();
			},
			error => {
				TransactionErrors.parseServerErrors(error).subscribe(
					content => {
						this.toastService.error('Error', content.msg, content.ref);
					},
					error => console.log(error)
				);
				this.unlockButton();
			}
		);
	}

}