import { ValidatorFn, AbstractControl, FormGroup, FormControl } from '@angular/forms'

import { Team } from '../team'
import { TeamService } from '../team.service'
import { Messages } from '../../dyna-common/messages'

import {Observable} from 'rxjs/Rx';
import 'rxjs/Rx';

export class TeamValidator {

  formErrors = {
    'name': [],
    'active': []
  };

  messages: Messages = new Messages();

  constructor (private form: FormGroup = null, 
               private teamService: TeamService = null,
               private team: Team = null){
      this.teamUniqueNameValidator(this.form);
  }

  addErrorIfTeamExist(control: AbstractControl): void {
    if (control.value && control.value != '') {
      this.teamService
          .getByName(control.value)
          .subscribe(data => {
            if (data && data._id != this.team._id){
              if (!control.hasError('nameNotUnique')){
                if (control.errors == null){
                  control.setErrors({'nameNotUnique': ''});
                } else {
                  control.errors['nameNotUnique'] = true;  
                }
              }
            } 
          });  
    }
  }

  teamUniqueNameValidator(form: FormGroup): void {
      if (form == null){ return; }
      let control = form.get('name');
      control.valueChanges
             .debounceTime(350) //waits for user to stop typing
             .distinctUntilChanged()
             .subscribe(data => {
               this.addErrorIfTeamExist(control);
             });
  }

  clearErrors(): void {
    for (const field in this.formErrors) {
      this.formErrors[field] = [];
    }
  }

  showErrors(): void {
    if (!this.form) { return; }
    const form = this.form;
    for (const field in this.formErrors) {
      this.formErrors[field] = [];
      const control = form.get(field);
      if (control) {
        for (const key in control.errors) {
          this.formErrors[field].push(this.messages.get(key));
        }
      }
    }
  }

  getErrorsFor(field: string): string[] {
    return this.formErrors[field];
  }

  hasErrorsFor(field: string): boolean {
    return this.getErrorsFor(field).length > 0;
  }
}
