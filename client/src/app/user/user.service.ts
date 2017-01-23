import { Http, Headers, Response } from '@angular/http';
import { UserComponent } from './user.component';
import { Observable } from 'rxjs';
import { Injectable, Injector } from '@angular/core';
import { Globals } from '../app.globals';

@Injectable()
export class UserService {

  private http: Http;
  private headers: Headers;

  constructor(injector: Injector) {
    setTimeout(() => this.http = injector.get(Http))
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
  }

  /**
   * Find an specific user by ID from backend.
   */
  findById(id: string): Observable<UserComponent> {
    return this.http
      .get(`${Globals.API_URL}/user/${id}`)
      .map(res => res.json());
  }

  save(user: UserComponent) {
    if (user._id) {
      return this.http
        .put(`${Globals.API_URL}/user/${user._id}`, JSON.stringify(user), { headers: this.headers })
        .map(() => console.log('usuario alterado com suesso'));
    } else {
      return this.http
        .post(`${Globals.API_URL}/user/`, JSON.stringify(user), { headers: this.headers })
        .map(() => console.log('usuario inserido com suesso'));
    }
  }

  remove(user: UserComponent): Observable<Response> {
    return this.http.delete(`${Globals.API_URL}/user/${user._id}`);
  }

  getStoredUser(): UserComponent {
    return JSON.parse(localStorage.getItem(Globals.LOCAL_USER));
  }

  storeUser(user: UserComponent) {
    localStorage.setItem(Globals.LOCAL_USER, JSON.stringify(user));
  }

  removeStoredUser() {
    localStorage.removeItem(Globals.LOCAL_USER);
  }

}