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

  constructor(private transactionService: TransactionService, private teamService: TeamService, private userService: UserService) {
    this.getWallet();
  }

  ngOnInit() {
    this.transactionService.getTransactionAdded().subscribe((transaction: Transaction) => {
      this.getWallet();
    });
  }

  getWallet() {
    this.transactionService.getWallet(this.userService.getStoredUser(), this.teamService.getCurrentTeam()).subscribe(
      wallet => {
        console.log('recebi essa wallet', wallet);
        this.myDynas = Math.floor(Math.random() * 11) * 100;
        this.dynasReceived = Math.floor(Math.random() * 11) * 100;
      }
    );
  }

}
