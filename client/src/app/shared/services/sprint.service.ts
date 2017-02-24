import { Globals } from '../../app.globals';
import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { Sprint } from '../models/sprint';

@Injectable()
export class SprintService {

    http: Http;
    headers: Headers;
    sprintUrl = `${Globals.API_URL}/sprint`;

    constructor(http: Http) {
        this.http = http;
        this.headers = new Headers();
        this.headers.append('Content-Type', 'application/json');
    }

    all(): Promise<Sprint[]> {
        return this.http
                   .get(this.sprintUrl)
                   .toPromise()
                   .then(response => response.json() as Sprint[])
                   .catch(this.handleError);
    }
    
    findById(id: string): Promise<Sprint> {
        return this.http
                   .get(`${this.sprintUrl}/${id}`)
                   .toPromise()
                   .then(response => response.json());
    }

    findCurrent(): Observable<Sprint> {
        return this.http
                   .get(`${this.sprintUrl}/find/current`)
                   .map(res => res.json())
                   .catch(error => Observable.throw(error._body));
    }

    findlast(): Observable<Sprint> {
        return this.http
            .get(`${this.sprintUrl}/find/last`)
            .map(res => res.json())
			.catch(error => Observable.throw(error._body));
    }

    getIntersected(date: Date): Observable<Sprint[]> {
        return this.http
            .get(`${this.sprintUrl}/intersects/${date}`)
            .map(res => res.json() as Sprint[])
    }

    save(sprint: Sprint): Promise<Sprint> {
        if (sprint._id) {
            return this.put(sprint);
        }
        return this.post(sprint);
    }

    // Add
    private post(sprint: Sprint): Promise<Sprint> {
        return this.http
            .post(this.sprintUrl, JSON.stringify(sprint), { headers: this.headers })
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
    }

    // Update
    private put(sprint: Sprint): Promise<Sprint> {
        let url = `${this.sprintUrl}/${sprint._id}`;
        return this.http
            .put(url, JSON.stringify(sprint), { headers: this.headers })
            .toPromise()
            .then(() => sprint)
            .catch(this.handleError);
    }

    insert(sprint: Sprint): Observable<Sprint> {
        return this.http
            .post(this.sprintUrl, JSON.stringify(sprint), { headers: this.headers })
            .map((res) => res.json())
			.catch(error => Observable.throw(error._body));
    }

    delete(sprint: Sprint): Promise<Response> {
        let url = `${this.sprintUrl}/${sprint._id}`;
        return this.http
        .delete(url, { headers: this.headers })
        .toPromise()
        .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        return Promise.reject(error.message || error);
    }
}