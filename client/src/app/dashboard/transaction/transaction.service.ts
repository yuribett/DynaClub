import { AppService } from '../../app.service';
import { UserService } from '../../shared/services/user.service';
import { Transaction } from './transaction';
import { Team } from '../../shared/models/team';
import { Globals } from '../../app.globals';
import { User } from '../../shared/models/user';
import { TransactionComponent } from './transaction.component';
import { Injectable } from '@angular/core';
import { Response, Http, Headers } from '@angular/http';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';
import * as io from 'socket.io-client';
import { NotificationService } from '../../notification.service';


@Injectable()
export class TransactionService {

	http: Http;
	headers: Headers;
	subjectTransactionAdded: Subject<Transaction> = new Subject<Transaction>();

	constructor(http: Http, private userService: UserService, private appService: AppService, private notificationService: NotificationService) {
		this.http = http;
		this.headers = new Headers();
		this.headers.append('Content-Type', 'application/json');
		this.appService.getSocket().on('transaction', transaction => {
			if (transaction.from._id != this.userService.getStoredUser()._id) {
				this.notificationService.notify({
					body: `Voc&ecirc; recebeu D$ ${transaction.amount} de ${transaction.from.name}!`,
					title: `Voc&ecirc; recebeu uma doa&ccedil;&atilde;o`
				}).subscribe(error => console.log(error));
			}
			this.subjectTransactionAdded.next(transaction);
		});
	}

	findByUser(user: User, team: Team) {
		return this.http
			.get(`${Globals.API_URL}/transaction/${user._id}/${team._id}`)
			.map(res => res.json())
			.catch(error => Observable.throw(error._body));
	}

	getWallet(user: User, team: Team) {
		return this.http
			.get(`${Globals.API_URL}/wallet/${user._id}/${team._id}`)
			.map(res => res.json())
			.catch(error => Observable.throw(error._body));
	}

	insert(transaction: Transaction): Observable<Transaction> {
		return this.http
			.post(`${Globals.API_URL}/transaction/`, JSON.stringify(transaction), { headers: this.headers })
			.map(res => res.json())
			.catch(error => Observable.throw(error._body));
	}

	onTransactionsAdded(): Observable<Transaction> {
		return this.subjectTransactionAdded.asObservable();
	}

}
