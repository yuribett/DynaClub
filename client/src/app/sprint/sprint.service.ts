import { Globals } from '../app.globals';
import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs';
import { Sprint } from './sprint';

@Injectable()
export class SprintService {

    http: Http;
    headers: Headers;

    constructor(http: Http) {
        this.http = http;
        this.headers = new Headers();
        this.headers.append('Content-Type', 'application/json');
    }

    findCurrent(): Observable<Sprint> {
        return this.http
            .get(`${Globals.API_URL}/sprint/find/current`)
            .map(res => res.json())
			.catch(error => Observable.throw(error._body));
    }

    findlast(): Observable<Sprint> {
        return this.http
            .get(`${Globals.API_URL}/sprint/find/last`)
            .map(res => res.json())
			.catch(error => Observable.throw(error._body));
    }

    insert(sprint: Sprint): Observable<Sprint> {
        return this.http
            .post(`${Globals.API_URL}/sprint/`, JSON.stringify(sprint), { headers: this.headers })
            .map((res) => res.json())
			.catch(error => Observable.throw(error._body));
    }

}