import { TransactionComponent } from './transaction.component';
import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
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

  findById(id: string): Observable<TransactionComponent> {
    return this.http
      .get(this.url + '/' + id)
      .map(res => res.json());
  }

}
