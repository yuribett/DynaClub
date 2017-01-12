import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { DashbordComponent } from './dashbord/dashbord.component';
import { AdminComponent } from './admin/admin.component';

const appRoutes: Routes = [
    {path: '', component: DashbordComponent},
    {path: 'login', component: LoginComponent},
    {path: 'admin', component: AdminComponent},
    {path: '**', component: DashbordComponent}
];

export const routing = RouterModule.forRoot(appRoutes);