//Modules
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule, Http } from '@angular/http';
import { DashboardModule } from './dashboard/dashboard.module';

//Components
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminComponent } from './admin/admin.component';
import { ProfileComponent } from './settings/profile/profile.component';

//Services
import { AuthService } from './auth/auth.service';
import { UserService } from './user/user.service';

//Other
import { routing } from './app.routes';
import 'rxjs/add/operator/map';
import { LoggedInGuard } from './auth/logged.in.guard';
import { HttpService } from './auth/http.service';

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
    DashboardModule
  ],
  providers: [
    { provide: Http, useClass: HttpService },
    LoggedInGuard,
    AuthService,
    UserService],
  bootstrap: [AppComponent]
})
export class AppModule { }
