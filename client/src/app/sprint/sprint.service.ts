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

    findCurrentSprint(): Observable<Sprint> {
        return this.http
            .get(`${Globals.API_URL}/sprint/5891f0b5bbcf3e29a0142139`)
            .map(res => res.json());
    }

    insert(sprint: Sprint): Observable<Sprint> {
        return this.http
            .post(`${Globals.API_URL}/sprint/`, JSON.stringify(sprint), { headers: this.headers })
            .map((res) => res.json());
    }

}