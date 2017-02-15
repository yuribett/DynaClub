import { TransactionType } from './transaction-type';
import { Globals } from '../../../app.globals';
import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs';


@Injectable()
export class TransactionTypeService {

  http: Http;
  headers: Headers;

  constructor(http: Http) {
    this.http = http;
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
  }

  find(): Observable<Array<TransactionType>> {
    return this.http
      .get(`${Globals.API_URL}/transactionType/`)
      .map(res => res.json())
			.catch(error => Observable.throw(error._body));
  }

  insert(type: TransactionType): Observable<TransactionType> {
    return this.http
      .post(`${Globals.API_URL}/transactionType/`, JSON.stringify(type), { headers: this.headers })
      .map((res) => res.json())
			.catch(error => Observable.throw(error._body));
  }

}
