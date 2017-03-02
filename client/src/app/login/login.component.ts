import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { AppComponent } from '../app.component';
import { UserService } from '../shared/services/user.service';
import { AppService } from '../app.service';
import { User } from '../shared/models/user';
import { Globals } from '../app.globals';

const { version: appVersion } = require('../../../package.json')

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

	public user: string;
	public password: string;
	public msgError: string;
	public stayConnected: boolean = false;
	private router: Router;
	private authService: AuthService;
	private app: AppComponent;
	private appVersion: string;

	constructor(
		router: Router,
		authService: AuthService,
		app: AppComponent,
		private userService: UserService,
		private appService: AppService) {
		this.router = router;
		this.authService = authService;
		this.app = app;
		this.appVersion = appVersion;
	}

	ngOnInit() {
	}

	signin() {
		let _self = this;
		this.authService.auth(new AuthLogin(this.user, this.password, this.stayConnected)).subscribe(() => {
			if (this.authService.isLoggedIn()) {
				_self.addAppData();
				this.router.navigate(['/dashboard']);
			}
		}, err => {
			this.msgError = 'Dados de login incorretos';
			console.log(err);
		});

	}

	addAppData() {
		this.appService.setUser(this.userService.getStoredUser());
		this.appService.setCurrentTeam(JSON.parse(this.appService.getStorage().getItem(Globals.CURRENT_TEAM)));
	}

}

export class AuthLogin {

	public user: string;
	public password: string;
	public stayConnected: boolean;

	constructor(user: string, password: string, stayConnected: boolean) {
		this.user = user;
		this.password = password;
		this.stayConnected = stayConnected;
	}
}


