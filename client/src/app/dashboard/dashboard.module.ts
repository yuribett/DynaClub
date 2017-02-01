import { WalletComponent } from './wallet/wallet.component';
import { TransactionService } from './transaction/transaction.service';
import { TransactionComponent } from './transaction/transaction.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { DonateComponent } from './donate/donate.component';

import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule, FormsModule
  ],
  exports: [DashboardComponent, TransactionComponent, WalletComponent],
  declarations: [DashboardComponent, TransactionComponent, WalletComponent, DonateComponent],
  providers: [TransactionService]
})
export class DashboardModule { }
