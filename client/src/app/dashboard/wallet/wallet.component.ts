import { Team } from '../../shared/models/team';
import { Wallet } from '../../shared/models/wallet';
import { AppService } from '../../app.service';
import { UserService } from '../../shared/services/user.service';
import { TeamService } from '../../shared/services/team.service';
import { Transaction } from '../transaction/transaction';
import { TransactionService } from '../transaction/transaction.service';
import { OnDestroy, Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

@Component({
	selector: 'app-wallet',
	templateUrl: './wallet.component.html',
	styleUrls: ['./wallet.component.css']
})
export class WalletComponent implements OnInit, OnDestroy {

	wallet: Wallet = new Wallet();
	_subTransactionsAdded: Subscription;
	_subCurrentTeam: Subscription;

	constructor(private transactionService: TransactionService, private teamService: TeamService, private userService: UserService, private appService: AppService) {
		this.getWallet();
	}

	async getWallet(team: Team = this.teamService.getCurrentTeam()) {
		this.wallet = await this.transactionService.getWallet(this.userService.getStoredUser(), team);
	}

	ngOnInit() {
		this._subTransactionsAdded = this.transactionService.onTransactionsAdded().subscribe((transaction: Transaction) => {
			this.getWallet();
		});

		this._subCurrentTeam = this.appService.getCurrentTeam().subscribe((team: Team) => {
			this.getWallet(team);
		});

		this.transactionService.onTransactionsUpdated().subscribe((transactionUpdated: Transaction) => {
			this.getWallet();
		});

		this.transactionService.onTransactionsEdit().subscribe((transactionEdited: Transaction) => {
			this.getWallet();
		});
	}

	ngOnDestroy() {
		this._subTransactionsAdded.unsubscribe();
		this._subCurrentTeam.unsubscribe();
	}

}
