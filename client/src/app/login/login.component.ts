import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

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

    constructor(router: Router, authService : AuthService) { 
        this.router = router;
        this.authService = authService;
    }

    ngOnInit() {
    }

    onButtonLoginClick() {
        this.authService.autentica(new AuthLogin(this.user, this.password)).subscribe(e => {
            if(this.authService.isLoggedIn()){
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


