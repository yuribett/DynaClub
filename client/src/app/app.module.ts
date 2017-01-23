//Modules
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule, XHRBackend } from '@angular/http';
import { UserModule } from './user/user.module';
import { DashboardModule } from './dashboard/dashboard.module';

//Components
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminComponent } from './admin/admin.component';

//Other
import { routing } from './app.routes';
import 'rxjs/add/operator/map';
import { ExtendedXHRBackend } from './auth/extended.xhr.backend';
import { AuthService } from './auth/auth.service';
import { LoggedInGuard } from './auth/logged.in.guard';
import { ProfileComponent } from './settings/profile/profile.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AdminComponent,
    ProfileComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    routing,
    UserModule,
    DashboardModule
  ],
  providers: [{ provide: XHRBackend, useClass: ExtendedXHRBackend },
    LoggedInGuard,
    AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
