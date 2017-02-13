import { Team } from '../../teams/team';
import { AppService } from '../../app.service';
import { UserService } from '../../user/user.service';
import { TeamService } from '../../teams/team.service';
import { Transaction } from '../transaction/transaction';
import { TransactionService } from '../transaction/transaction.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.css']
})
export class WalletComponent implements OnInit {

  myDynas: Number;
  dynasReceived: Number;

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
        //TODO - subtrair wallet.totalDonated pelo valor padrao da Sprint.
        this.myDynas = 1000 - wallet.totalDonated;
        this.dynasReceived = wallet.totalReceived;
      }
    );
  }

}
