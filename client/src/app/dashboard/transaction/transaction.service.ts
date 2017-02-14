import { AppService } from '../../app.service';
import { UserService } from '../../user/user.service';
import { Transaction } from './transaction';
import { Team } from '../../teams/team';
import { Globals } from '../../app.globals';
import { User } from '../../user/user';
import { TransactionComponent } from './transaction.component';
import { Injectable } from '@angular/core';
import { Response, Http, Headers } from '@angular/http';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';
import * as io from 'socket.io-client';


@Injectable()
export class TransactionService {

	http: Http;
	headers: Headers;
	subjectTransactionAdded: Subject<Transaction> = new Subject<Transaction>();

	constructor(http: Http, private userService: UserService, private appService: AppService) {
		this.http = http;
		this.headers = new Headers();
		this.headers.append('Content-Type', 'application/json');
		this.appService.getSocket().on('transaction', (transaction) => {
			let Notification: any = window["Notification"];
			Notification.requestPermission().then(function (result) {
				var options = {
					body: `Voc&ecirc; recebeu D$ ${transaction.amount} de ${transaction.from.name}!`,
					icon: '',
					requireInteraction: true
				}
				new Notification('Voc&ecirc; recebeu uma doa&ccedil;&atilde;o', options);
			});
			this.subjectTransactionAdded.next(transaction);
		});
	}

	findByUser(user: User, team: Team) {
		return this.http
			.get(`${Globals.API_URL}/transaction/` + user._id + '/' + team._id + '/5891f0b5bbcf3e29a0142139')
			.map(res => res.json())
			.catch(error => Observable.throw(error._body));
	}

	getWallet(user: User, team: Team) {
		return this.http
			.get(`${Globals.API_URL}/wallet/` + user._id + '/' + team._id + '/5891f0b5bbcf3e29a0142139')
			.map(res => res.json())
			.catch(error => Observable.throw(error._body));
	}

	insert(transaction: Transaction): Observable<Transaction> {
		console.log(transaction);
		return this.http
			.post(`${Globals.API_URL}/transaction/`, JSON.stringify(transaction), { headers: this.headers })
			.map(res => res.json())
			.catch(error => Observable.throw(error._body));
	}

	onTransactionsAdded(): Observable<Transaction> {
		return this.subjectTransactionAdded.asObservable();
	}

}
