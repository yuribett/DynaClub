import { Globals } from '../../app.globals';
import { Team } from '../../teams/team';
import { AppService } from '../../app.service';
import { UserService } from '../../user/user.service';
import { TransactionService } from '../transaction/transaction.service';
import { Transaction } from '../transaction/transaction';
import { TransactionComponent } from '../transaction/transaction.component';
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css']
})
export class SummaryComponent implements OnInit {

  transactions: Array<Transaction>;
  transactionService: TransactionService;
  userService: UserService;
  appService: AppService;

  constructor(transactionService: TransactionService, userService: UserService, appService: AppService) {
    this.transactionService = transactionService;
    this.userService = userService;
    this.appService = appService;
    let _currentTeam: Team = JSON.parse(localStorage.getItem(Globals.CURRENT_TEAM));;
    this.loadTransactions(_currentTeam);
  }

  ngOnInit() {
    this.appService.getCurrentTeam().subscribe((team: Team) => {
      this.loadTransactions(team);
    });
  }

  loadTransactions(team: Team) {
    this.transactionService.findByUser(this.userService.getStoredUser(), team).subscribe(
      p => this.transactions = p,
      err => console.log(err)
    );
  }

}
