import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminComponent } from './admin/admin.component';
import { TeamSearchComponent } from './teams/team-search/team-search.component';
import { TeamDetailComponent } from './teams/team-detail/team-detail.component';
import { ProfileComponent } from './settings/profile/profile.component';
import { LoggedInGuard } from './auth/logged.in.guard';
import { RankingComponent } from './ranking/ranking.component';

const appRoutes: Routes = [

	{ path: 'dashboard', component: DashboardComponent, canActivate: [LoggedInGuard] },
	{ path: 'login', component: LoginComponent },
	{ path: 'admin', component: AdminComponent, canActivate: [LoggedInGuard] },
	{ path: 'teams', component: TeamSearchComponent },
    { path: 'team/edit/:id', component: TeamDetailComponent },
    { path: 'team/new', component: TeamDetailComponent },
	{ path: 'ranking', component: RankingComponent, canActivate: [LoggedInGuard] },
	{ path: 'profile', component: ProfileComponent, canActivate: [LoggedInGuard] },
	{ path: '**', component: DashboardComponent, canActivate: [LoggedInGuard] }

];

export const routing = RouterModule.forRoot(appRoutes);