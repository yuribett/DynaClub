import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.css']
})
export class WalletComponent implements OnInit {

  myDynas: Number;
  dynasReceived: Number;

  constructor() {
    this.myDynas = Math.floor(Math.random() * 11) * 100;
    this.dynasReceived = Math.floor(Math.random() * 11) * 100;
  }

  ngOnInit() {
  }

}
