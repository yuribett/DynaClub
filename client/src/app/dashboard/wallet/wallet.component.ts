import { Team } from '../../shared/models/team';
import { Wallet } from '../../shared/models/wallet';
import { AppService } from '../../app.service';
import { UserService } from '../../shared/services/user.service';
import { TeamService } from '../../shared/services/team.service';
import { Transaction } from '../transaction/transaction';
import { TransactionService } from '../transaction/transaction.service';
import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-wallet',
	templateUrl: './wallet.component.html',
	styleUrls: ['./wallet.component.css']
})
export class WalletComponent implements OnInit {

	wallet: Wallet = new Wallet();

	constructor(private transactionService: TransactionService, private teamService: TeamService, private userService: UserService, private appService: AppService) {
		this.getWallet();
	}

	ngOnInit() {
		this.transactionService.onTransactionsAdded().subscribe((transaction: Transaction) => {
			this.getWallet();
		});

		this.appService.getCurrentTeam().subscribe((team: Team) => {
			this.getWallet(team);
		});
	}

	getWallet(team: Team = this.teamService.getCurrentTeam()) {
		this.transactionService.getWallet(this.userService.getStoredUser(), team).subscribe(
			wallet => {
				console.log('segura a wallet', wallet);
				this.wallet = wallet;
			});
	}

}
