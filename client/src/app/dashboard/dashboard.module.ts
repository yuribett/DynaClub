import { WalletComponent } from './wallet/wallet.component';
import { TransactionService } from './transaction/transaction.service';
import { TransactionComponent } from './transaction/transaction.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { DonateComponent } from './donate/donate.component';
import { NotificationService } from '../notification.service';

import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { TransactionTypeService } from '../shared/services/transaction-type.service';
import { TransactionTypeComponent } from './transaction/transaction-type/transaction-type.component';
import { SimpleNotificationsModule } from 'angular2-notifications';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
		SimpleNotificationsModule.forRoot(),
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
        TransactionTypeService,
        NotificationService
    ]
})
export class DashboardModule { }
