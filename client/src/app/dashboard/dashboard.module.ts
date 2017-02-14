import { WalletComponent } from './wallet/wallet.component';
import { TransactionService } from './transaction/transaction.service';
import { TransactionComponent } from './transaction/transaction.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { DonateComponent } from './donate/donate.component';

import { FormsModule } from '@angular/forms';
import { TransactionTypeService } from './transaction/transaction-type/transaction-type.service';
import { TransactionTypeComponent } from './transaction/transaction-type/transaction-type.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule
    ],
    exports: [
        DashboardComponent,
        TransactionComponent,
        WalletComponent
    ],
    declarations: [
        DashboardComponent,
        TransactionComponent,
        WalletComponent,
        DonateComponent,
        TransactionTypeComponent
    ],
    providers: [
        TransactionService,
        TransactionTypeService
    ]
})
export class DashboardModule { }
