import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

    login: string;
    password: string;

    constructor() { }

    ngOnInit() {
    }

    onButtonLoginClick() {
        console.log('Login', this.login, 'Password', this.password);
    }

}
