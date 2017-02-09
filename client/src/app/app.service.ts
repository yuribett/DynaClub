import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { User } from './user/user';
import { Team } from './teams/team';
import { Globals } from './app.globals';
import * as io from 'socket.io-client';

@Injectable()
export class AppService {

	private user: User;
	private subjectUser: Subject<User> = new Subject<User>();
	private currentTeam: Team;
	private subjectCurrentTeam: Subject<Team> = new Subject<Team>();

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

	//IO SERVICES

	private socket;

	getIoTransactions(): Observable<{}> {
		let observable = new Observable(observer => {
			this.socket = io.connect(Globals.SOCKET_IO_URL, 
				{query: 'user='+JSON.parse(this.getStorage().getItem(Globals.LOCAL_USER))._id});
			this.socket.on('transaction', (data) => {
				observer.next(data);
			});
			return () => {
				this.socket.disconnect();
			};
		})
		return observable;
	}

}
