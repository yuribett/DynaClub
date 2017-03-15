import { Injectable } from '@angular/core';
import { Sprint } from '../shared/models/sprint';
import { Team } from '../shared/models/team';
import { Globals } from '../app.globals';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { Ranking } from './ranking'

@Injectable()
export class RankingService {

  rankingUrl: string = `${Globals.API_URL}/ranking`;

  constructor(private http: Http) {
        this.http = http;
    }

  getMainRanking(sprint: Sprint, team: Team): Promise<Ranking[]>{
    return this.http
                   .get(`${this.rankingUrl}/${team._id}/${sprint._id}`)
                   .toPromise()
                   .then(response => response.json() as Ranking[])
                   .catch((err) => console.log(err));
  }

}
