import { TransactionService } from './transaction.service';
import { TransactionStatus } from '../../shared/enums/transactionStatus';
import { UserService } from '../../shared/services/user.service';
import { Transaction } from './transaction';
import { User } from '../../shared/models/user';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
declare var $: any;

@Component({
	selector: 'app-transaction',
	templateUrl: './transaction.component.html',
	styleUrls: ['./transaction.component.less']
})
export class TransactionComponent implements OnInit {

	@Input() transaction: Transaction;
	@Output() private change = new EventEmitter<Transaction>();
	loggedUser: User;

	constructor(userService: UserService, private _transactionService: TransactionService) {
		this.loggedUser = userService.getStoredUser();
	}

	ngOnInit() {
		$('.transaction').tooltip();
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
		if (this.transaction.status != null
			&& this.transaction.status != TransactionStatus.NORMAL) {
			return this.isCredit() ? `Pedido a ${this.transaction.from.name}` : `Pedido por ${this.transaction.to.name}`;
		} else {
			return this.isCredit() ? this.transaction.from.name : this.transaction.to.name;
		}
	}

	isRequester(): boolean {
		return this.transaction.requester._id == this.loggedUser._id;
	}

	canEdit(): boolean {
		const today: Date = new Date();
		return this.transaction.status == 1
			&& this.transaction.sprint.dateStart <= today
			&& this.transaction.sprint.dateFinish >= today
	}

	private update(status: TransactionStatus) {
		this.transaction.status = status;
		this.change.next(this.transaction);
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
		console.log('Edit');
	}

}