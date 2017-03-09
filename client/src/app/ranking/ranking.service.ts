import { Injectable } from '@angular/core';
import { Sprint } from '../shared/models/sprint';
import { Team } from '../shared/models/team';
import { Globals } from '../app.globals';

@Injectable()
export class RankingService {

  sprintUrl = `${Globals.API_URL}/ranking`;

  constructor() { }

  getMainRanking(sprint: Sprint, team: Team){

  }

}
