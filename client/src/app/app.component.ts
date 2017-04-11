import { TransactionStatus } from './shared/enums/transactionStatus';
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

			this.appService.getSocket().on('transaction.added', transaction => {
				this.notify(
					`Voc&ecirc; recebeu uma doa&ccedil;&atilde;o`,
					`Voc&ecirc; recebeu D$ ${transaction.amount} de ${transaction.from.name}!`);
			});

			this.appService.getSocket().on('transaction.requested', transaction => {
				this.notify(
					`Voc&ecirc; recebeu um pedido`,
					`${transaction.requester.name} pediu D$ ${transaction.amount}!`);
			});

			this.appService.getSocket().on('transaction.denied', transaction => {
				this.notify(
					`Doa&ccedil;&atilde;o atualizada`,
					`${transaction.from.name} negou seu pedido!`);
			});

			this.appService.getSocket().on('transaction.accepted', transaction => {
				this.notify(
					`Doa&ccedil;&atilde;o atualizada`,
					`${transaction.from.name} aceitou seu pedido!`);
			});

			this.appService.getSocket().on('transaction.canceled', transaction => {
				this.notify(
					`Doa&ccedil;&atilde;o atualizada`,
					`${transaction.requester.name} cancelou a Doa&ccedil;&atilde;o!`);
			});

			this.appService.getSocket().on('transaction.request.canceled', transaction => {
				this.notify(
					`Doa&ccedil;&atilde;o atualizada`,
					`${transaction.requester.name} cancelou o pedido!`);
			});

		}
	}

	private notify(title: string, body: string) {
		this.notificationService.notify({
			body: body,
			title: title,
			icon: `./assets/images/icon-dollar-150x150.png`,
			wrapBody: true,
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

}
