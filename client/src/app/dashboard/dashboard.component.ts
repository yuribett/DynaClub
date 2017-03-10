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
	styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

	transactions: Array<Transaction>;
	pendingTransactions: Array<Transaction>;
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

		this.transactionService.onTransactionsAdded().subscribe((transaction: Transaction) => {
			if (transaction.status == TransactionStatus.PENDING) {
				this.pendingTransactions.unshift(transaction);
			} else {
				this.transactions.unshift(transaction);
			}
		});
	}

	loadTransactions(team: Team = this.teamService.getCurrentTeam()) {
		this.transactions = null;
		this.transactionService.findByUser(this.userService.getStoredUser(), team).subscribe(
			transactions => {
				this.transactions = transactions.filter(transaction => transaction.status != TransactionStatus.PENDING);
				this.pendingTransactions = transactions.filter(transaction => transaction.status == TransactionStatus.PENDING);
			},
			err => console.log(err)
		);
	}

	onTransactionChange(transactionUpdated: Transaction) {
		this.pendingTransactions = this.pendingTransactions.filter(transaction => transaction._id != transactionUpdated._id);
	}

}
