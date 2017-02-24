import { ViewContainerRef, Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SprintService } from '../../../shared/services/sprint.service';
import { Sprint } from '../../../shared/models/sprint';
import { Overlay } from 'angular2-modal';
import { Modal } from 'angular2-modal/plugins/bootstrap';
import { Router } from '@angular/router';

@Component({
  selector: 'tr[sprint-search-item]',
  templateUrl: './sprint-search-item.component.html',
  styleUrls: ['./sprint-search-item.component.css']
})
export class SprintSearchItemComponent implements OnInit {

  @Input() sprint: Sprint;
  @Output() afterDelete: EventEmitter<Sprint> = new EventEmitter<Sprint>();
  edit = false;

  constructor(overlay: Overlay, 
              vcRef: ViewContainerRef, 
              private router: Router,
              public modal: Modal, 
              private sprintService: SprintService) {
    overlay.defaultViewContainer = vcRef;
  }

  ngOnInit() {
  }

  deleteSprint(){
    this.sprintService.delete(this.sprint).then(() => {
      this.afterDelete.emit(this.sprint);
    })
  }

  onEdit(): void {
    let link = ['/sprint/edit/', this.sprint._id];
    this.router.navigate(link);
  }

  onDelete(): void {
    this.modal.confirm()
        .size('sm')
        .showClose(true)
        .title('Exclusão')
        .body(`<h4>Confirma exclusão da sprint?</h4>`)
        .open()
        .catch((err: any) => this.unexpectedErrorDialog(err))
        .then((dialog: any) => { return dialog.result })
        //CONFIRMED
        .then((result: any) => { this.deleteSprint() })
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
