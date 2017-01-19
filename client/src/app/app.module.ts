//Modules
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { UserModule } from './user/user.module';
import { TransactionModule } from './dashboard/transaction/transaction.module';
import { SummaryModule} from './dashboard/summary/summary.module';


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

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    AdminComponent,
    DashboardComponent,
    WalletComponent,
    ProfileComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    routing,
    UserModule,
    TransactionModule,
    SummaryModule
  ],
  providers: [{ provide: XHRBackend, useClass: ExtendedXHRBackend },
    LoggedInGuard,
    AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
