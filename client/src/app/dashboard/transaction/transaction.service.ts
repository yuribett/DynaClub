import { UserComponent } from '../../user/user.component';
import { TransactionComponent } from './transaction.component';
import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs';


@Injectable()
export class TransactionService {

  http: Http;
  headers: Headers;
  url: string = 'http://localhost:3000/transaction/';

  constructor(http: Http) {
    this.http = http;
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
  }

  findByUser(user: UserComponent): Observable<TransactionComponent> {
    return this.http
      .get(this.url + '/' + user)
      .map(res => res.json());
  }

}
