import { Component, OnInit } from '@angular/core';
import { TransactionService } from '../../dashboard/transaction/transaction.service';
import { Transaction } from '../../dashboard/transaction/transaction';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { Team } from '../../shared/models/team';
import { TeamService } from '../../shared/services/team.service';
import { Sprint } from '../../shared/models/sprint';
import { SprintService } from '../../shared/services/sprint.service';

@Component({
  selector: 'app-ranking-detail',
  templateUrl: './ranking-detail.component.html',
  styleUrls: ['./ranking-detail.component.css']
})
export class RankingDetailComponent implements OnInit {

  sprintID: string;
  teamID: string;
  userID: string;
  index: number = 0;
  transactions: Transaction[];
  sprint: Sprint = new Sprint();
  team: Team = new Team();

  constructor(
    private transactionService: TransactionService,
    private route: ActivatedRoute,
    private teamService: TeamService,
    private sprintService: SprintService) {
      this._loadTransactions();
      this._setSprint();
      this._setTeam();
  }

  _loadTransactions(){

    this.route.params.forEach((params: Params) => {
      if (params['id'] !== undefined) {
        this.userID = params['id'];
      }

      if (params['team'] !== undefined) {
        this.teamID = params['team'];
      }

      if (params['sprint'] !== undefined) {
        this.sprintID = params['sprint']
      }

    });

    this.transactionService.findByUserTeamSprintIDs(this.userID, this.sprintID, this.teamID)
      .subscribe(
        transactions => this.transactions = transactions,
        err => console.log(err)
      );
  }

  _setSprint() {
    this.sprintService.findById(this.sprintID)
      .then(sprint => {
        this.sprint = sprint;
      })
      .catch(err => console.log(err));
  }

  _setTeam() {
    this.teamService.findById(this.teamID)
      .then(team => {
        this.team = team;
      })
      .catch(err => console.log(err));
  }

  setFilter(index: number) {
    this.index = index;
  }

  ngOnInit() { 
  }

}
