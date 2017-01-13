import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

    private login: string;
    private password: string;
    private router: Router;

    constructor(router: Router) { 
        this.router = router;
    }

    ngOnInit() {
    }

    onButtonLoginClick() {
        console.log('Login', this.login, 'Password', this.password);
        this.router.navigate(['/admin']);
    }

}
