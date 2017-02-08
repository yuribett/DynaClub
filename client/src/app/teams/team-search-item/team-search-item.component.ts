import { ViewContainerRef, Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TeamService } from '../team.service';
import { Team } from '../team';
import { Overlay } from 'angular2-modal';
import { Modal } from 'angular2-modal/plugins/bootstrap';
import { Router } from '@angular/router';

@Component({
  selector: 'tr[team-search-item]',
  templateUrl: './team-search-item.component.html',
  styleUrls: ['./team-search-item.component.css']
})
export class TeamSearchItemComponent implements OnInit {

  @Input() team: Team;
  @Output() afterDelete: EventEmitter<Team> = new EventEmitter<Team>();
  edit = false;

  constructor(overlay: Overlay, 
              vcRef: ViewContainerRef, 
              private router: Router,
              public modal: Modal, 
              private teamService: TeamService) {
    overlay.defaultViewContainer = vcRef;
  }

  ngOnInit() {
  }

  deleteTeam(){
    this.teamService.delete(this.team).then(() => {
      this.afterDelete.emit(this.team);
    })
  }

  onEdit(): void {
    //let link = ['/team/edit', this.team._id];
    //this.router.navigate(link);
  }

  onDelete(): void {
    this.modal.confirm()
        .size('sm')
        .showClose(true)
        .title('Exclusão')
        .body(`<h4>Confirma exclusão da equipe '${this.team.name}'?</h4>`)
        .open()
        .catch((err: any) => this.unexpectedErrorDialog(err))
        .then((dialog: any) => { return dialog.result })
        //CONFIRMED
        .then((result: any) => { this.deleteTeam() })
        //CANCELLED
        .catch((err: any) => {});    
  }

  unexpectedErrorDialog(error: any): void {
    this.modal.alert()
        .size('sm')
        .isBlocking(true)
        .showClose(false)
        .keyboard(27)
        .title('Oops')
        .body(`Ocorreu um erro inesperado: ${error}`)
        .open();
  } 

}
