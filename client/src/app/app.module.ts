//Modules
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { UserModule } from './user/user.module';
import { TransactionModule } from './dashboard/transaction/transaction.module';


//Components
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminComponent } from './admin/admin.component';

//Other
import { routing } from './app.routes';
import 'rxjs/add/operator/map';
import { XHRBackend } from '@angular/http';
import { ExtendedXHRBackend } from './auth/extended.xhr.backend';
import { AuthService } from './auth/auth.service';
import { LoggedInGuard } from './auth/logged.in.guard';
import { WalletComponent } from './dashboard/wallet/wallet.component';
import { ProfileComponent } from './settings/profile/profile.component';
import { SummaryComponent } from './dashboard/summary/summary.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    AdminComponent,
    DashboardComponent,
    WalletComponent,
    ProfileComponent,
    SummaryComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    routing,
    UserModule,
    TransactionModule
  ],
  providers: [{ provide: XHRBackend, useClass: ExtendedXHRBackend },
    LoggedInGuard,
    AuthService, TransactionModule],
  bootstrap: [AppComponent]
})
export class AppModule { }
