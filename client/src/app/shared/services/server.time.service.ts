import { Globals } from '../../app.globals';
import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs';

@Injectable()
export class ServerTimeService {

    private headers: Headers;
    private serverClientDiffInMillis: number;

    constructor(private http: Http) {
        this.headers = new Headers({ 'Content-Type': 'application/json' });
    }

    public load(): Promise<void> {
        return this.http
            .get(`${Globals.API_URL}/timesync/`)
            .toPromise()
            .then(res => {
                const _serverTime = new Date(res.json().date);
                const _clientTime = new Date();
                this.serverClientDiffInMillis = _serverTime.getTime() - _clientTime.getTime();
            }).catch(err => console.log(err));
    }

    public getServerTime(): Date {
        return new Date(new Date().getTime() + this.serverClientDiffInMillis);
    }

}