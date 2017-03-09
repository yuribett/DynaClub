import { TransactionStatus } from '../../shared/enums/transactionStatus';
import { UserService } from '../../shared/services/user.service';
import { Transaction } from './transaction';
import { User } from '../../shared/models/user';
import { Component, OnInit, Input } from '@angular/core';

@Component({
	selector: 'app-transaction',
	templateUrl: './transaction.component.html',
	styleUrls: ['./transaction.component.less']
})
export class TransactionComponent implements OnInit {

	@Input() transaction: Transaction;
	loggedUser: User;

	constructor(userService: UserService) {
		this.loggedUser = userService.getStoredUser();
	}

	ngOnInit() {
		console.log(this.transaction);
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

	edit() {
		console.log('Edit');
	}

	accept() {
		console.log('Accept');
	}
	deny() {
		console.log('Deny');
	}
	cancel() {
		console.log('Cancel');
	}

}