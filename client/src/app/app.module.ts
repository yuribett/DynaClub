//Angular
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule, Http } from '@angular/http';

//Modules
import { DashboardModule } from './dashboard/dashboard.module';
import { TeamModule } from './teams/team.module';
import { DynaCommonModule } from './dyna-common/dyna-common.module'
import { Ng2Bs3ModalModule } from 'ng2-bs3-modal/ng2-bs3-modal';

//Components
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { AdminComponent } from './admin/admin.component';
import { ProfileComponent } from './settings/profile/profile.component';
import { MenuComponent } from './menu/menu.component';

//Services
import { AuthService } from './auth/auth.service';
import { UserService } from './user/user.service';
import { AppService } from './app.service';

//Others
import { routing } from './app.routes';
import 'rxjs/add/operator/map';
import { LoggedInGuard } from './auth/logged.in.guard';
import { HttpService } from './auth/http.service';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AdminComponent,
    ProfileComponent,
    MenuComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    routing,
    DashboardModule,
    TeamModule,
    DynaCommonModule,
    Ng2Bs3ModalModule
  ],
  providers: [
    { provide: Http, useClass: HttpService },
    LoggedInGuard,
    AuthService,
    UserService,
    AppService,
    MenuComponent // TODO wtf?
    ],
  bootstrap: [AppComponent]
})
export class AppModule { }
