import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { AppComponent } from '../app.component';
import { UserService } from '../user/user.service';
import { AppService } from '../app.service';
import { User } from '../user/user';
import { Globals } from '../app.globals';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

    public user: string;
    public password: string;
    public msgError: string;
    private router: Router;
    private authService : AuthService;
    private app: AppComponent;
    
    constructor( 
        router: Router, 
        authService : AuthService, 
        app: AppComponent, 
        private userService: UserService, 
        private appService: AppService) { 
            this.router = router;
            this.authService = authService;
            this.app = app;
    }

    ngOnInit() {
    }

    signin() {
        let _self = this;
        this.authService.autentica(new AuthLogin(this.user, this.password)).subscribe(() => {
            if(this.authService.isLoggedIn()){
                _self.addAppData();
                this.router.navigate(['/dashboard']);
            } else {
                this.msgError = 'Usu&aacute;rio ou senha incorreto.';
            }
        });
        
    }

    addAppData(){
        this.appService.setUser(this.userService.getStoredUser());
        this.appService.setCurrentTeam(JSON.parse(localStorage.getItem(Globals.CURRENT_TEAM)));
    }

}

export class AuthLogin {
    
    public user: string;
    public password: string;
    
    constructor(user: string, password: string){
        this.user = user;
        this.password = password;
    }
}


