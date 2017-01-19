import { UserService } from '../../user/user.service';
import { TransactionService } from '../transaction/transaction.service';
import { TransactionComponent } from '../transaction/transaction.component';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css']
})
export class SummaryComponent implements OnInit {

  transactions: Array<TransactionComponent>;
  transactionService: TransactionService;
  userService: UserService;

  constructor(transactionService: TransactionService, userService: UserService) {
    this.transactionService = transactionService;
    this.userService = userService;
    //this.transactions = this.transactionService.findByUser(userService.getStoredUser());
  }

  ngOnInit() {
  }

}
