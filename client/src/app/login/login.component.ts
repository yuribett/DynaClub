import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { AppComponent } from '../app.component';
import { UserService } from '../user/user.service';
import { AppService } from '../app.service';
import { User } from '../user/user';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

    public user: string;
    public password: string;
    private router: Router;
    private authService : AuthService;
    private app: AppComponent;

    constructor( 
        router: Router, 
        authService : AuthService, 
        app: AppComponent, 
        private userService: UserService, 
        private _sharedService: AppService) { 
            this.router = router;
            this.authService = authService;
            this.app = app;
    }

    ngOnInit() {
    }

    signin() {
        let _self = this;
        this.authService.autentica(new AuthLogin(this.user, this.password)).subscribe(e => {
            if(this.authService.isLoggedIn()){
                _self.addAppData(_self.userService.getStoredUser());

                this.router.navigate(['/']);
            }
        });
        
    }

    addAppData(user: User){
        this._sharedService.setUser(user);
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


