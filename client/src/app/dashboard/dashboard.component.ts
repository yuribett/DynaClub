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
import { Component, OnInit } from '@angular/core';


@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.less']
})
export class DashboardComponent implements OnInit {

	transactions: Array<Transaction>;
	wallet: Wallet = new Wallet();

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
		});

		this.transactionService.onTransactionsUpdated().subscribe((transactionUpdated: Transaction) => {
			this.transactions.forEach((transaction, i) => {
				if (transaction._id == transactionUpdated._id) {
					this.transactions[i] = transactionUpdated;
				}
			});
		});
	}

	hasTransactions(): boolean {
		return this.transactions != null && this.transactions.length > 0;
	}

	hasPendingTransactions(): boolean {
		return this.hasTransactions() && this.transactions.filter(transaction => transaction.status == TransactionStatus.PENDING).length > 0;
	}

	loadTransactions(team: Team = this.teamService.getCurrentTeam()) {
		this.transactions = null;
		this.transactionService.findByUser(this.userService.getStoredUser(), team).subscribe(
			transactions => this.transactions = transactions,
			err => console.log(err)
		);
	}

}
