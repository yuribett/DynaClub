import { Globals } from '../../app.globals';
import { User } from '../../user/user';
import { TransactionComponent } from './transaction.component';
import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs';


@Injectable()
export class TransactionService {

  http: Http;
  headers: Headers;

  constructor(http: Http) {
    this.http = http;
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
  }

  findByUser(user: User) {
    return this.http
      .get(Globals.API_URL + '/transaction/' + user._id)
      .map(res => res.json());
  }

}
