import { TeamService } from '../teams/team.service';
import { Globals } from '../app.globals';
import { Team } from '../teams/team';
import { AppService } from '../app.service';
import { UserService } from '../user/user.service';
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

  constructor(private transactionService: TransactionService, private userService: UserService, private appService: AppService, private teamService: TeamService) {
    this.transactionService = transactionService;
    this.userService = userService;
    this.appService = appService;
    this.loadTransactions(teamService.getCurrentTeam());
  }

  ngOnInit() {
    this.appService.getCurrentTeam().subscribe((team: Team) => {
      this.loadTransactions(team);
    });

    this.transactionService.onTransactionsAdded().subscribe((transaction: Transaction) => {
      console.log('DashboardComponent - Transaction recebida', transaction);
      this.transactions.unshift(transaction);
    });
  }

  loadTransactions(team: Team) {
    this.transactions = null;
    this.transactionService.findByUser(this.userService.getStoredUser(), team).subscribe(
      p => this.transactions = p,
      err => console.log(err)
    );
  }

}
