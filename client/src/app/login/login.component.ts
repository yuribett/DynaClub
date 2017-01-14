import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../auth/user.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

    public user: string;
    public password: string;
    private router: Router;
    private userService : UserService;

    constructor(router: Router, userService : UserService) { 
        this.router = router;
        this.userService = userService;
    }

    ngOnInit() {
    }

    onButtonLoginClick() {
        this.userService.autentica(new AuthLogin(this.user, this.password)).subscribe(e => {
            console.log('subs', e);
            console.log('logged in:', this.userService.isLoggedIn())
            if(this.userService.isLoggedIn()){
                this.router.navigate(['/dashboard']);
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


