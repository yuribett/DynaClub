import { ValidatorFn, AbstractControl, FormGroup, FormControl } from '@angular/forms'
import {Observable} from 'rxjs/Rx';

import { BaseFormValidator } from '../../../shared/base.form.validator'

import { Team } from '../../../shared/models/team'
import { TeamService } from '../../../shared/services/team.service'

export class TeamValidator extends BaseFormValidator {

  constructor (form: FormGroup = null, 
               private teamService: TeamService = null,
               private team: Team = null){
      super(form);
      this.teamUniqueNameValidator(this.form);
  }

  addErrorIfTeamExist(control: AbstractControl): void {
    if (control.value && control.value != '') {
      this.teamService
          .getByName(control.value)
          .subscribe(data => {
            if (data && data._id != this.team._id){
              this.addError(control, 'nameNotUnique');
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

}
