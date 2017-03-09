import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
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
		private appService: AppService,
		private route: ActivatedRoute) {
		this.router = router;
		this.authService = authService;
		this.app = app;
		this.appVersion = appVersion;
	}

	ngOnInit() {
		this.loadAccessToken();
	}

	/**
	 * Function called when user access the login page.
	 * We search if it have the oAuth token, indicating that is a callback calling, 
	 * then we proced with the oAuth autorization.
	 */
	loadAccessToken(): void {
		let _self = this;
		this.route.queryParams.subscribe(params => {
			let oAuthToken = params['oauth_token'];
			let oAuthVerifier = params['oauth_verifier'];
			if (oAuthToken !== undefined) {
				_self.oAuthSignInCallback(oAuthToken, oAuthVerifier);
				return;
			}
		});
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

	/**
	 * Request to server an authorization to authenticate using JIRA oAuth.
	 */
	oAuthSignIn() {
		let _self = this;
		this.authService.oAuth().subscribe((response) => {
			let body = response.json();
			let url = body.url;
			let oauthTokenSecret = body.oauthTokenSecret;
			this.appService.getStorage().setItem(Globals.OAUTH_TOKEN_SECRET, oauthTokenSecret);
			window.location.href = body.url;
		}, err => {
			this.msgError = 'Erro ao autenticar usando o JIRA';
			console.log(err);
		});
	}

	/**
	 * Callback called from JIRA passing the user's token.
	 * With that information we pass it to the server  for request and load user's information.
	 */
	oAuthSignInCallback(oauthToken: string, oauthVerifier: string): void {
		let _self = this;
		let oauthTokenSecret = this.appService.getStorage().getItem(Globals.OAUTH_TOKEN_SECRET);
		this.authService.oAuthAutorizeCallback(oauthToken, oauthTokenSecret, oauthVerifier).subscribe((response) => {
			if (this.authService.isLoggedIn()) {
				_self.addAppData();
				this.router.navigate(['/dashboard']);
			}
		}, err => {
			this.msgError = 'Erro ao autenticar usando o JIRA';
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


