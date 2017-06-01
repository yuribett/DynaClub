import { TransactionStatus } from '../shared/enums/transactionStatus';
import { TeamService } from '../shared/services/team.service';
import { Globals } from '../app.globals';
import { Team } from '../shared/models/team';
import { Wallet } from '../shared/models/wallet';
import { AppService } from '../app.service';
import { UserService } from '../shared/services/user.service';
import { TransactionService } from './transaction/transaction.service';
import { Transaction } from './transaction/transaction';
import { TransactionComponent } from './transaction/transaction.component';
import { Component, OnInit, ViewChild } from '@angular/core';


@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.less']
})
export class DashboardComponent implements OnInit {

	filteredTransactions: Array<Transaction>;
	transactions: Array<Transaction>;
	wallet: Wallet = new Wallet();
	receivedCheck: boolean = true;
	sentCheck: boolean = true;
	pendingCheck: boolean = true;
	canceledCheck: boolean = true;

	constructor(private transactionService: TransactionService, private userService: UserService, private appService: AppService, private teamService: TeamService) {
		this.transactionService = transactionService;
		this.userService = userService;
		this.appService = appService;
		this.loadTransactions();
	}

	ngOnInit() {
		this.appService.getCurrentTeam().subscribe((team: Team) => {
			this.loadTransactions(team);
		});

		this.transactionService.onTransactionsAdded().subscribe((transactionAdded: Transaction) => {
			this.transactions.unshift(transactionAdded);
			this.applyFilters();
		});

		this.transactionService.onTransactionsUpdated().subscribe((transactionUpdated: Transaction) => {
			this.transactions.forEach((transaction, i) => {
				if (transaction._id == transactionUpdated._id) {
					this.transactions[i] = transactionUpdated;
				}
			});
			this.applyFilters();
		});
	}

	hasTransactions(): boolean {
		return this.transactions != null && this.transactions.length > 0;
	}

	hasPendingTransactions(): boolean {
		return this.hasTransactions() && this.filteredTransactions.filter(transaction => transaction.status == TransactionStatus.PENDING).length > 0;
	}

	applyFilters() {
		this.filteredTransactions = this.transactions.filter(transaction => this.canShowTransaction(transaction));
	}

	canShowTransaction(transaction: Transaction): boolean {
		switch (transaction.status) {
			case TransactionStatus.PENDING:
				return this.pendingCheck;
			case TransactionStatus.DENIED:
			case TransactionStatus.CANCELED:
				return this.canceledCheck;
			case TransactionStatus.NORMAL:
				return this.isReceived(transaction) ? this.receivedCheck : this.sentCheck;
			default:
				return false;
		}
	}

	isReceived(transaction): boolean {
		return this.userService.getStoredUser()._id == transaction.to._id;
	}

	loadTransactions(team: Team = this.teamService.getCurrentTeam()) {
		this.transactions = null;
		this.transactionService.findByUser(this.userService.getStoredUser(), team).subscribe(
			transactions => {
				this.transactions = transactions;
				this.applyFilters();
			},
			err => console.log(err)
		);
	}

}
