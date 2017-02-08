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

  constructor(private transactionService: TransactionService) {
    this.myDynas = Math.floor(Math.random() * 11) * 100;
    this.dynasReceived = Math.floor(Math.random() * 11) * 100;
  }

  ngOnInit() {
    this.transactionService.getTransactionAdded().subscribe((transaction: Transaction) => {
      console.log('transaction adicionada, reloada essa porra!', transaction);
      this.myDynas = Math.floor(Math.random() * 11) * 100;
      this.dynasReceived = Math.floor(Math.random() * 11) * 100;
    });
  }

}
