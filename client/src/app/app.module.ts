//Angular
import { BrowserModule, } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule, Http } from '@angular/http';

//Modules
import { DashboardModule } from './dashboard/dashboard.module';
import { RankingModule } from './ranking/ranking.module';
import { TeamModule } from './admin/teams/team.module';
import { SprintModule } from './admin/sprints/sprint.module';
import { DynaCommonModule } from './shared/dyna-common.module';
import { ModalModule } from 'angular2-modal';
import { BootstrapModalModule } from 'angular2-modal/plugins/bootstrap';

//Components
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { AdminComponent } from './admin/admin.component';
import { ProfileComponent } from './settings/profile/profile.component';
import { MenuComponent } from './menu/menu.component';
import { ConfigsComponent } from './settings/configs/configs.component';
import { AboutComponent } from './settings/about/about.component';
import { TransactionTypesComponent } from './admin/transaction-types/transaction-types.component';
import { UsersComponent } from './admin/users/users.component';

//Services
import { AuthService } from './auth/auth.service';
import { UserService } from './shared/services/user.service';
import { AppService } from './app.service';
import { SprintService } from './shared/services/sprint.service';
import { NotificationService } from './notification.service';

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
		MenuComponent,
		ConfigsComponent,
		AboutComponent,
		TransactionTypesComponent,
		UsersComponent
	],
	imports: [
		BrowserModule,
		FormsModule,
		ReactiveFormsModule,
		HttpModule,
		routing,
		ModalModule.forRoot(),
		BootstrapModalModule,
		DashboardModule,
		RankingModule,
		TeamModule,
		SprintModule,
		DynaCommonModule,
		BrowserAnimationsModule
	],
	providers: [
		{ provide: Http, useClass: HttpService },
		LoggedInGuard,
		AuthService,
		UserService,
		AppService,
		SprintService,
		NotificationService,
		MenuComponent // TODO wtf? Really... W.T.F!
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
