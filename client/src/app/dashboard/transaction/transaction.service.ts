import { TeamService } from '../../shared/services/team.service';
import { AppService } from '../../app.service';
import { UserService } from '../../shared/services/user.service';
import { Transaction } from './transaction';
import { Team } from '../../shared/models/team';
import { Wallet } from '../../shared/models/wallet';
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
	subjectTransactionUpdated: Subject<Transaction> = new Subject<Transaction>();
	subjectTransactionEdit: Subject<Transaction> = new Subject<Transaction>();

	constructor(http: Http, private userService: UserService, private appService: AppService, private teamService: TeamService) {
		this.http = http;
		this.headers = new Headers();
		this.headers.append('Content-Type', 'application/json');
		this.appService.getSocket().on('transaction.added', transaction => {
			if (transaction.team._id === this.teamService.getCurrentTeam()._id) {
				this.subjectTransactionAdded.next(transaction);
			}
		});
		this.appService.getSocket().on('transaction.updated', transaction => {
			if (transaction.team._id === this.teamService.getCurrentTeam()._id) {
				this.subjectTransactionUpdated.next(transaction);
			}
		});
	}
 
	findByUser(user: User, team: Team): Observable<Array<Transaction>> {
		return this.http
			.get(`${Globals.API_URL}/transaction/${user._id}/${team._id}`)
			.map(res => res.json())
			.catch(error => Observable.throw(error._body));
	}

	getWallet(user: User, team: Team): Promise<Wallet> {
		return this.http
			.get(`${Globals.API_URL}/wallet/${user._id}/${team._id}`)
			.map(res => res.json())
			.toPromise()
			.catch(error => Promise.reject(error._body));
	}

	insert(transaction: Transaction): Observable<Transaction> {
		return this.http
			.post(`${Globals.API_URL}/transaction/`, JSON.stringify(transaction), { headers: this.headers })
			.map(res => {
				this.subjectTransactionAdded.next(res.json());
				return res.json();
			})
			.catch(error => Observable.throw(error._body));
	}

	update(transaction: Transaction): Observable<Transaction> {
		return this.http
			.put(`${Globals.API_URL}/transaction/`, JSON.stringify(transaction), { headers: this.headers })
			.map(res => {
				this.subjectTransactionUpdated.next(res.json());
				return res.json();
			})
			.catch(error => Observable.throw(error._body));
	}

	edit(transaction: Transaction) {
		this.subjectTransactionEdit.next(transaction)
	}
	
	onTransactionsAdded(): Observable<Transaction> {
		return this.subjectTransactionAdded.asObservable();
	}
	
	onTransactionsUpdated(): Observable<Transaction> {
		return this.subjectTransactionUpdated.asObservable();
	}

	onTransactionsEdit(): Observable<Transaction> {
		return this.subjectTransactionEdit.asObservable();
	}

}
