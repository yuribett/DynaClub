import { WalletComponent } from './wallet/wallet.component';
import { TransactionService } from './transaction/transaction.service';
import { TransactionComponent } from './transaction/transaction.component';
import { SummaryComponent } from './summary/summary.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [DashboardComponent, TransactionComponent, SummaryComponent, WalletComponent],
  declarations: [DashboardComponent, TransactionComponent, SummaryComponent, WalletComponent],
  providers: [TransactionService]
})
export class DashboardModule { }
