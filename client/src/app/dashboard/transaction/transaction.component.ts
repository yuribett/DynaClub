import { TeamService } from '../../shared/services/team.service';
import { TransactionService } from './transaction.service';
import { TransactionStatus } from '../../shared/enums/transactionStatus';
import { UserService } from '../../shared/services/user.service';
import { Transaction } from './transaction';
import { User } from '../../shared/models/user';
import { Component, OnInit, Input, Output, EventEmitter, HostBinding } from '@angular/core';
import { NotificationsService } from 'angular2-notifications';

@Component({
	selector: 'app-transaction',
	templateUrl: './transaction.component.html',
	styleUrls: ['./transaction.component.less']
})
export class TransactionComponent implements OnInit {

	@Input() transaction: Transaction;
	loggedUser: User;
	canCancel: Boolean = false;
	canEdit: Boolean = false;
	canAccept: Boolean = false;
	@HostBinding('class.top') _top: boolean = false;
	@HostBinding('class.bottom') _bottom: boolean = false;
	canDeny: Boolean = false;
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

	constructor(_userService: UserService, private _transactionService: TransactionService, private _teamService: TeamService, private _toastService: NotificationsService) {
		this.loggedUser = _userService.getStoredUser();
	}

	ngOnInit() {
		const _today: Date = new Date();
		const _transactionDate: Date = new Date(this.transaction.date);
		const _timeDiff: number = _today.getTime() - _transactionDate.getTime();
		const _dateStart: Date = new Date(this.transaction.sprint.dateStart);
		const _dateFinish: Date = new Date(this.transaction.sprint.dateFinish);
		const _fiveMinutes: number = 300000;
		this.canAccept = false;
		this.canDeny = false;
		this.canCancel = false;

		if (this.transaction.status == 1 && _dateStart <= _today && _dateFinish >= _today) {
			const isRequester = this.transaction.requester != null && this.transaction.requester._id == this.loggedUser._id;
			this.canAccept = !isRequester;
			this.canDeny = !isRequester;
			this.canCancel = isRequester;
		} else if (this.transaction.status == 0 && !this.isCredit() && _timeDiff < _fiveMinutes) {
			this.canCancel = true;
			setTimeout(() => {
				this.canCancel = false;
			}, (_fiveMinutes - _timeDiff));
		}

		this._top = this.transaction.status == TransactionStatus.PENDING;
		this._bottom = !this._top;
	}

	isCredit(): boolean {
		return this.loggedUser._id == this.transaction.to._id;
	}

	getStyle(): string {
		switch (this.transaction.status) {
			case TransactionStatus.PENDING:
				return "pending";
			case TransactionStatus.DENIED:
			case TransactionStatus.CANCELED:
				return "canceled";
			default:
				return this.isCredit() ? "credit" : "debit";
		}
	}

	getTitle(): string {
		switch (this.transaction.status) {
			case TransactionStatus.PENDING:
				return "Pendente";
			case TransactionStatus.DENIED:
				return "Negada";
			case TransactionStatus.CANCELED:
				return "Cancelada";
			default:
				return this.isCredit() ? "Recebida" : "Enviada";
		}
	}
	getDisplayName(): string {
		if (this.transaction.status == TransactionStatus.PENDING) {
			return this.isCredit() ? `(Pedido a)${this.transaction.from.name}` : `(Pedido por)${this.transaction.to.name}`;
		} else {
			return this.isCredit() ? this.transaction.from.name : this.transaction.to.name;
		}
	}

	private async update(status: TransactionStatus) {
		if (status == TransactionStatus.ACCEPTED) {
			let wallet = await this._transactionService.getWallet(this.loggedUser, this._teamService.getCurrentTeam());
			if (wallet.funds < this.transaction.amount) {
				this._toastService.error('Error', 'Saldo insuficiente!');
				return;
			}
		}

		this.transaction.status = status;

		this._transactionService.update(this.transaction).subscribe(
			transaction => {
				this.transaction = transaction;
				this.ngOnInit();
			},
			error => console.log(error)
		);
	}

	accept() {
		this.update(TransactionStatus.ACCEPTED);
	}

	deny() {
		this.update(TransactionStatus.DENIED);
	}
	cancel() {
		this.update(TransactionStatus.CANCELED);
	}
	edit() {
	}

}