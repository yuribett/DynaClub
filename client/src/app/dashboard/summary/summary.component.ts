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

  constructor(transactionService: TransactionService, userService: UserService) {
    this.transactionService = transactionService;
    this.userService = userService;

    transactionService.findByUser(userService.getStoredUser()).subscribe(
      p => this.transactions = p,
      err => console.log(err)
    );
    
    console.log(this.transactions);
  }

  ngOnInit() {
  }

}
