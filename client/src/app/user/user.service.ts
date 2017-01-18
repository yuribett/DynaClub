import { Http, Headers, Response } from '@angular/http';
import { UserComponent } from './user.component';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable()
export class UserService {

  private http: Http;
  private headers: Headers;
  private url: string = 'http://localhost:3000/user';
  private localStorageKey: string = 'dynaclub-user';

  constructor(http: Http) {
    this.http = http;
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
  }

  /**
   * Find an specific user by ID from backend.
   */
  findById(id: string): Observable<UserComponent> {
    return this.http
      .get(this.url + '/' + id)
      .map(res => res.json());
  }

  getStoredUser(): UserComponent {
    return JSON.parse(localStorage.getItem(this.localStorageKey));
  }

  storeUser(user: UserComponent) {
    localStorage.setItem(this.localStorageKey, JSON.stringify(user));
  }

  removeStoredUser() {
    localStorage.removeItem(this.localStorageKey);
  }

}
