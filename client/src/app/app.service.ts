import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { User } from './shared/models/user';
import { Team } from './shared/models/team';
import { Globals } from './app.globals';
import { Response, Http, Headers } from '@angular/http';
import * as io from 'socket.io-client';

@Injectable()
export class AppService {

	private user: User;
	private serverTime: Date;
	private needToSyncServerTime: boolean = true;
	private headers: Headers;
	private subjectUser: Subject<User> = new Subject<User>();
	private currentTeam: Team;
	private subjectCurrentTeam: Subject<Team> = new Subject<Team>();
	private socket;

	constructor(private http: Http) {
		this.headers = new Headers();
		this.headers.append('Content-Type', 'application/json');
		this.syncServerTime();
	}


	private loadServerTime(): Promise<Date> {
		return this.http
			.get(`${Globals.API_URL}/timesync/`)
			.map(res => new Date(res.json().date))
			.toPromise()
			.catch(error => Promise.reject(error._body));
	}
	
	private async syncServerTime() {
		this.serverTime = await this.loadServerTime();
		this.needToSyncServerTime = false;
		setTimeout(() => {
			this.needToSyncServerTime = true;
		}, 30000);
	}

	getServerTime(): Date {
		if (this.needToSyncServerTime) {
			this.syncServerTime();
		}
		return this.serverTime;
	}

	getSocket() {
		if (!this.socket) {
			let user = JSON.parse(this.getStorage().getItem(Globals.LOCAL_USER));
			if (user) {
				this.socket = io.connect(Globals.SOCKET_IO_URL, {
					query: 'user=' + user._id
				});
				this.socket.on('disconnect', () => {
					this.socket.disconnect();
				});
			}
		}
		return this.socket;
	}

	//USER SERVICES
	setUser(user: User): void {
		this.user = user;
		this.subjectUser.next(user);
	}

	getUser(): Observable<User> {
		return this.subjectUser.asObservable();
	}

	setCurrentTeam(currentTeam: Team): void {
		this.currentTeam = currentTeam;
		this.subjectCurrentTeam.next(currentTeam);
	}

	getCurrentTeam(): Observable<Team> {
		return this.subjectCurrentTeam.asObservable();
	}

	// STORAGE SERVICES
	getStorage() {
		if (localStorage.getItem(Globals.USER_LOCAL_STORAGE) == "1") {
			return localStorage;
		} else {
			return sessionStorage;
		}
	}

	setLocalStorage(local: boolean) {
		if (local) {
			localStorage.setItem(Globals.USER_LOCAL_STORAGE, "1");
		} else {
			localStorage.setItem(Globals.USER_LOCAL_STORAGE, "0");
		}
	}

	clearStorage() {
		localStorage.clear();
		sessionStorage.clear();
	}

}
