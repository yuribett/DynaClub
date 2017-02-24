
import { Sprint } from '../../../shared/models/sprint'
import { SprintService } from '../../../shared/services/sprint.service'
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'sprint-search',
  templateUrl: './sprint-search.component.html',
  styleUrls: ['./sprint-search.component.css']
})
export class SprintSearchComponent implements OnInit {

  @ViewChild('modal')
  sprints: Sprint[];
  error: any;

  constructor(private router:Router, private sprintService: SprintService) {}

  ngOnInit() {
    this.loadSprints();
  }

  loadSprints(): void {
    this.sprintService
        .all()
        .then(sprints => this.sprints = sprints )
        .catch(error => this.error = error);
  }

  gotoNewSprint(): void {
    this.router.navigateByUrl('/sprint/new');
  }
  
  afterDelete(sprint): void {
    this.loadSprints();
  }
}
