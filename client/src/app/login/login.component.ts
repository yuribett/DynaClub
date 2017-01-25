import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { AppComponent } from '../app.component';
import { UserService } from '../user/user.service';

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

    constructor( router: Router, authService : AuthService, private app: AppComponent, private userService: UserService) { 
        this.router = router;
        this.authService = authService;
    }

    ngOnInit() {
    }

    signin() {
        this.authService.autentica(new AuthLogin(this.user, this.password)).subscribe(e => {
            if(this.authService.isLoggedIn()){
                this.app.name = this.userService.getStoredUser().name;
                this.app.admin = this.userService.getStoredUser().admin;
                this.router.navigate(['/']);
            }
        });
        
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


