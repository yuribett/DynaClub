import { Component, OnInit } from '@angular/core';
import { MenuComponent } from './menu/menu.component';
import { AuthService } from './auth/auth.service';
import { UserService } from './shared/services/user.service';
import { AppService } from './app.service';

const { version: appVersion } = require('../../package.json')

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

	name: string;
	admin: boolean;
	private connection;
	private appVersion;	

	constructor(private authService: AuthService, private user: UserService, private appService: AppService) {
		if (this.authService.isLoggedIn()) {
			this.name = this.user.getStoredUser().name;
			this.admin = this.user.getStoredUser().admin;
			this.appVersion = appVersion
		}
	}

	ngOnInit() {

	}

}
