import { AppService } from '../app.service';
import { Globals } from '../app.globals';
import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';

import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/toPromise';
import { Team } from './team';

@Injectable()
export class TeamService {

  http: Http;
  headers: Headers;
  private teamsUrl = `${Globals.API_URL}/team`;

  constructor(http: Http, private appService: AppService) {
    this.http = http;
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
  }

  list(): Promise<Team[]> {
    return this.http
      .get(this.teamsUrl)
      .toPromise()
      .then(response => response.json() as Team[])
      .catch(this.handleError);
  }

  findById(id: string): Promise<Team> {
    return this.http
      .get(`${this.teamsUrl}/${id}`)
      .toPromise()
      .then(response => response.json());
  }

  getByName(name: String): Observable<Team> {
    return this.http
      .get(`${this.teamsUrl}/name/${name}`)
      .map(res => res.json())
  }

  findByName(name: string): Promise<Team> {
    return this.http
      .get(`${this.teamsUrl}/name/${name}`)
      .toPromise()
      .then(response => response.json());
  }
  
  save(team: Team): Promise<Team> {
    if (team._id) {
      return this.put(team);
    }
    return this.post(team);
  }

  // Add
  private post(team: Team): Promise<Team> {
    return this.http
      .post(this.teamsUrl, JSON.stringify(team), { headers: this.headers })
      .toPromise()
      .then(res => res.json())
      .catch(this.handleError);
  }

  // Update
  private put(team: Team): Promise<Team> {
    let url = `${this.teamsUrl}/${team._id}`;
    return this.http
      .put(url, JSON.stringify(team), { headers: this.headers })
      .toPromise()
      .then(() => team)
      .catch(this.handleError);
  }


  delete(team: Team): Promise<Response> {
    let url = `${this.teamsUrl}/${team._id}`;
    return this.http
      .delete(url, { headers: this.headers })
      .toPromise()
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    return Promise.reject(error.message || error);
  }

  getCurrentTeam(): Team {
    return JSON.parse(this.appService.getStorage().getItem(Globals.CURRENT_TEAM));
  }

}
