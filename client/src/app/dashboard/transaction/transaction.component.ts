import { TeamService } from '../../shared/services/team.service';
import { TransactionService } from './transaction.service';
import { TransactionStatus } from '../../shared/enums/transactionStatus';
import { UserService } from '../../shared/services/user.service';
import { Transaction } from './transaction';
import { User } from '../../shared/models/user';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NotificationsService } from 'angular2-notifications';

@Component({
	selector: 'app-transaction',
	templateUrl: './transaction.component.html',
	styleUrls: ['./transaction.component.less']
})
export class TransactionComponent implements OnInit {

	@Input() transaction: Transaction;
	@Output() private onChange = new EventEmitter<Transaction>();
	@Output() private onEdit = new EventEmitter<Transaction>();
	loggedUser: User;
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

	isRequester(): boolean {
		return this.transaction.requester != null && this.transaction.requester._id == this.loggedUser._id;
	}

	canEdit(): boolean {
		const today: Date = new Date();
		return this.transaction.status == 1;/*
			&& this.transaction.sprint.dateStart <= today
			&& this.transaction.sprint.dateFinish >= today;*/
	}

	private async update(status: TransactionStatus) {
		if (status == TransactionStatus.ACCEPTED) {
			let wallet = await this._transactionService.getWallet(this.loggedUser, this._teamService.getCurrentTeam());
			if (wallet.funds < this.transaction.amount) {
				this._toastService.error('Error', 'Saldo insuficiente!');
				return;
			}
		}
		console.log('Passou a treta toda!');
		this.transaction.status = status;
		this.onChange.next(this.transaction);
		this._transactionService.update(this.transaction).subscribe(
			transaction => console.log(transaction),
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
		this._transactionService.edit(this.transaction);
	}

}