import { Http, Headers, Response } from '@angular/http';
import { UserComponent } from './user.component';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable()
export class UserService {

  http: Http;
  headers: Headers;
  url: string = 'http://localhost:3000/user';

  constructor(http: Http) {
    this.http = http;
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
  }

  findById(id: string): Observable<UserComponent> {
    return this.http
      .get(this.url + '/' + id)
      .map(res => res.json());
  }

}
