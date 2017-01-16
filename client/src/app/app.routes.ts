import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminComponent } from './admin/admin.component';
import { LoggedInGuard } from './auth/logged.in.guard';

/*
const appRoutes: Routes = [
    {path: '', component: DashboardComponent, canActivate: [LoggedInGuard] },
    {path: 'login', component: LoginComponent},
    {path: 'admin', component: AdminComponent, canActivate: [LoggedInGuard] },
    {path: '**', component: DashboardComponent, canActivate: [LoggedInGuard] }
];
*/

const appRoutes: Routes = [
    {path: '', component: DashboardComponent },
    {path: 'login', component: LoginComponent},
    {path: 'admin', component: AdminComponent },
    {path: '**', component: DashboardComponent }
];

export const routing = RouterModule.forRoot(appRoutes);