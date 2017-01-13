import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { DashbordComponent } from './dashbord/dashbord.component';
import { AdminComponent } from './admin/admin.component';
import { LoggedInGuard } from './auth/logged.in.guard';

const appRoutes: Routes = [
    {path: '', component: DashbordComponent, canActivate: [LoggedInGuard] },
    {path: 'login', component: LoginComponent},
    {path: 'admin', component: AdminComponent, canActivate: [LoggedInGuard] },
    {path: '**', component: DashbordComponent, canActivate: [LoggedInGuard] }
];

export const routing = RouterModule.forRoot(appRoutes);