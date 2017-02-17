import { Team } from '../models/team';
import { Http, Headers, Response } from '@angular/http';
import { User } from '../models/user';
import { Observable } from 'rxjs';
import { Injectable, Injector } from '@angular/core';
import { Globals } from '../../app.globals';
import { AppService } from '../../app.service';

@Injectable()
export class UserService {

	private headers: Headers;
	private http: Http;

	constructor(http: Http, private appService: AppService) {
		this.http = http;
		this.headers = new Headers();
		this.headers.append('Content-Type', 'application/json');
	}

	/**
	 * Find an specific user by ID from backend.
	 */
	findById(id: string): Observable<User> {
		return this.http
			.get(`${Globals.API_URL}/user/${id}`)
			.map(res => res.json())
			.catch(error => Observable.throw(error._body));
	}

	/**
	 * Find all the users in the Team.
	 */
	findByTeam(team: Team): Observable<Array<User>> {
		return this.http
			.get(`${Globals.API_URL}/userTeam/${team._id}`)
			.map(res => res.json())
			.catch(error => Observable.throw(error._body));
	}

	save(user: User): Observable<User> {
		if (user._id) {

			console.log('update', user);
			console.log(`${Globals.API_URL}/user/${user._id}`);
			console.log(JSON.stringify(user));

			return this.http
				.put(`${Globals.API_URL}/user/${user._id}`, JSON.stringify(user), { headers: this.headers })
				.map((res) => res.json())
				.catch(error => Observable.throw(error._body));
		} else {

			console.log('insert', user);

			return this.http
				.post(`${Globals.API_URL}/user/`, JSON.stringify(user), { headers: this.headers })
				.map((res) => res.json())
				.catch(error => Observable.throw(error._body));
		}
	}

	remove(user: User): Observable<Response> {
		return this.http
			.delete(`${Globals.API_URL}/user/${user._id}`)
			.catch(error => Observable.throw(error._body));
	}

	getStoredUser(): User {
		return JSON.parse(this.appService.getStorage().getItem(Globals.LOCAL_USER));
	}

	storeUser(user: User) {
		this.appService.getStorage().setItem(Globals.LOCAL_USER, JSON.stringify(user));
	}

	removeStoredUser() {
		this.appService.getStorage().removeItem(Globals.LOCAL_USER);
	}

}