import { Transaction } from './transaction';
import { Team } from '../../teams/team';
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

  findByUser(user: User, team: Team) {
    return this.http
      .get(`${Globals.API_URL}/transaction/` + user._id + '/' + team._id + '/5891f0b5bbcf3e29a0142139')
      .map(res => res.json());
  }

  insert(transaction: Transaction): Observable<Transaction>  {
    console.log(transaction);
    return this.http
      .post(`${Globals.API_URL}/transaction/`, JSON.stringify(transaction), { headers: this.headers })
      .map((res) => res.json());
  }

}
