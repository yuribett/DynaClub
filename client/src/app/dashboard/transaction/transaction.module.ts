import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionComponent } from './transaction.component';
import { TransactionService } from './transaction.service';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [TransactionComponent],
  declarations: [TransactionComponent],
  providers: [TransactionService]
})
export class TransactionModule { }
