//Angular
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule, Http } from '@angular/http';

//Modules
import { DashboardModule } from './dashboard/dashboard.module';

//Components
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { AdminComponent } from './admin/admin.component';
import { ProfileComponent } from './settings/profile/profile.component';
import { MenuComponent } from './menu/menu.component';
import { RankingComponent } from './ranking/ranking.component';
import { SprintComponent } from './sprint/sprint.component';

//Services
import { AuthService } from './auth/auth.service';
import { UserService } from './user/user.service';
import { AppService } from './app.service';
import { SprintService } from './sprint/sprint.service';

//Others
import { routing } from './app.routes';
import 'rxjs/add/operator/map';
import { LoggedInGuard } from './auth/logged.in.guard';
import { HttpService } from './auth/http.service';
import { TestComponent } from './test/test.component';

@NgModule({
	declarations: [
		AppComponent,
		LoginComponent,
		AdminComponent,
		ProfileComponent,
		MenuComponent,
		RankingComponent,
		SprintComponent,
		TestComponent
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
		UserService,
		AppService,
		SprintService,
		MenuComponent // TODO wtf? Really... W.T.F!
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
