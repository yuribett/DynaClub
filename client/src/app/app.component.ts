import { Component, OnInit } from '@angular/core';
import { MenuComponent } from './menu/menu.component';
import { AuthService } from './auth/auth.service';
import { UserService } from './shared/services/user.service';
import { AppService } from './app.service';
import { NotificationService } from './notification.service';

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

	constructor(private authService: AuthService, private userService: UserService, private appService: AppService, private notificationService: NotificationService) {
		if (this.authService.isLoggedIn()) {
			this.name = this.userService.getStoredUser().name;
			this.admin = this.userService.getStoredUser().admin;
			this.appVersion = appVersion
		}
	}

	ngOnInit() {
		if (this.authService.isLoggedIn()) {
			this.appService.getSocket().on('transaction', transaction => {
				if (transaction.from._id != this.userService.getStoredUser()._id) {

					let body = `Voc&ecirc; recebeu D$ ${transaction.amount} de ${transaction.from.name}!`;

					this.notificationService.notify({
						body: this._parseNotificationBody(body),
						title: `Voc&ecirc; recebeu uma doa&ccedil;&atilde;o`,
						icon: `./assets/images/icon-dollar-150x150.png`,
						onclick: () => {
							try {
								window.focus();
							}
							catch (ex) {
								console.log(ex);
							}
						}
					}).subscribe(error => console.log(error));
				}
			});
		}
	}

	private _parseNotificationBody(body: string) {
		if (body.length > 38) {
			body = body.substr(0, 38) + '...';
		}
		return body;
	}

}
