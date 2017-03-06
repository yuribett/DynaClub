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

	isCredit(): boolean {
		return this.loggedUser._id == this.transaction.to._id;
	}

	getStyle() {
		return this.isCredit() ? "credit" : "debit";
	}

	ngOnInit() {
		console.log(this.transaction);
	}

}