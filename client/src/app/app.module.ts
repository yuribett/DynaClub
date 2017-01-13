//Modules
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

//Components
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { DashbordComponent } from './dashbord/dashbord.component';
import { AdminComponent } from './admin/admin.component';

//Other
import { routing } from './app.routes';
import 'rxjs/add/operator/map';
import { XHRBackend } from '@angular/http';
import { ExtendedXHRBackend } from './auth/extended.xhr.backend';
import { UserService } from './auth/user.service';
import { LoggedInGuard } from './auth/logged.in.guard';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashbordComponent,
    AdminComponent
  ],  
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule, 
    routing
  ],
  providers: [{ provide: XHRBackend, useClass: ExtendedXHRBackend }, LoggedInGuard, 
                UserService],
  bootstrap: [AppComponent]
})
export class AppModule { }
