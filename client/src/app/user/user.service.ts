import { Team } from '../teams/team';
import { Http, Headers, Response } from '@angular/http';
import { User } from './user';
import { Observable } from 'rxjs';
import { Injectable, Injector } from '@angular/core';
import { Globals } from '../app.globals';
import { AppComponent } from '../app.component';

@Injectable()
export class UserService {

  private headers: Headers;
  private http: Http;

  constructor(http: Http) {
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
      .map(res => res.json());
  }

  /**
   * Find all the users in the Team.
   */
  findByTeam(team: Team): Observable<Array<User>> {
    return this.http
      .get(`${Globals.API_URL}/userTeam/${team._id}`)
      .map(res => res.json());
  }

  save(user: User): Observable<User> {
    if (user._id) {

      console.log('update', user);
      console.log(`${Globals.API_URL}/user/${user._id}`);
      console.log(JSON.stringify(user));

      return this.http
        .put(`${Globals.API_URL}/user/${user._id}`, JSON.stringify(user), { headers: this.headers })
        .map((res) => res.json());
    } else {

      console.log('insert', user);

      return this.http
        .post(`${Globals.API_URL}/user/`, JSON.stringify(user), { headers: this.headers })
        .map((res) => res.json());
    }
  }

  remove(user: User): Observable<Response> {
    return this.http.delete(`${Globals.API_URL}/user/${user._id}`);
  }

  getStoredUser(): User {
    return JSON.parse(localStorage.getItem(Globals.LOCAL_USER));
  }

  storeUser(user: User) {
    localStorage.setItem(Globals.LOCAL_USER, JSON.stringify(user));
  }

  removeStoredUser() {
    localStorage.removeItem(Globals.LOCAL_USER);
  }

}