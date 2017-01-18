import { UserComponent } from '../../user/user.component';
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.css']
})
export class TransactionComponent implements OnInit {

  from: UserComponent;
  to: UserComponent;
  date: Date;
  amount: Number;
  message: String;

  constructor() { }

  ngOnInit() {
  }

}
