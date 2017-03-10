import { Injectable } from '@angular/core';
import { Sprint } from '../shared/models/sprint';
import { Team } from '../shared/models/team';
import { Globals } from '../app.globals';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { Ranking } from './ranking'

@Injectable()
export class RankingService {

  sprintUrl = `${Globals.API_URL}/ranking`;

  constructor(private http: Http) {
        this.http = http;
    }

  getMainRanking(sprint: Sprint, team: Team): Promise<Ranking[]>{
    console.log(sprint);
    console.log(team);
    return this.http
                   .get(`${this.sprintUrl}/${team._id}/${sprint._id}`)
                   .toPromise()
                   .then(response => response.json() as Ranking[])
                   .catch((err) => console.log(err));
  }

}
