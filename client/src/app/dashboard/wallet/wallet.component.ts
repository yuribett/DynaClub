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
	_subWallet: Subscription;

	constructor(private transactionService: TransactionService, private teamService: TeamService, private userService: UserService, private appService: AppService) {
		this.getWallet();
	}

	ngOnInit() {
		this._subTransactionsAdded = this.transactionService.onTransactionsAdded().subscribe((transaction: Transaction) => {
			this.getWallet();
		});

		this._subCurrentTeam = this.appService.getCurrentTeam().subscribe((team: Team) => {
			this.getWallet(team);
		});
	}

	ngOnDestroy() {
		this._subTransactionsAdded.unsubscribe();
		this._subCurrentTeam.unsubscribe();
		this._subWallet.unsubscribe();
	}

	getWallet(team: Team = this.teamService.getCurrentTeam()) {
		this._subWallet = this.transactionService.getWallet(this.userService.getStoredUser(), team).subscribe(
			wallet => this.wallet = wallet);
	}

}
