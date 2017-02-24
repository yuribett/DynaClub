import { ValidatorFn, AbstractControl, FormGroup, FormControl } from '@angular/forms'
import {Observable} from 'rxjs/Rx';

import { BaseFormValidator } from '../../../shared/base.form.validator'

import { Sprint } from '../../../shared/models/sprint'
import { SprintService } from '../../../shared/services/sprint.service'

export class SprintValidator extends BaseFormValidator {

  constructor (form: FormGroup = null, 
               private sprintService: SprintService = null,
               private sprint: Sprint = null){
      super(form);

      if (form == null){
        return;
      }
      
      this.sprintIntersectsValidator(form.get('dateStart'));
      this.sprintIntersectsValidator(form.get('dateFinish'));
      this.initialAmountValidator(form.get('initialAmount'));
  }

  initialAmountValidator(control: AbstractControl): void {
      control.valueChanges
             .subscribe(data => {
               if (data <= 0){
                this.addError(control, 'initialAmountPositive');
               }
             });
  }

  addErrorIfSprintExist(control: AbstractControl): void {
    if (control.value && control.value != '') {
      console.log(control.value);
      this.sprintService
          .getIntersected(control.value)
          .subscribe(data => {
            if (data){
                for (let obj of data){
                  if (obj._id != this.sprint._id){
                    this.addError(control, 'sprintIntersected');
                    break;
                  } 
                }
            } 
          });  
    }
  }
  
  sprintIntersectsValidator(control: AbstractControl): void {
      if (control == null){ 
        return; 
      }
      control.valueChanges
             .debounceTime(350) //waits for user to stop typing
             .distinctUntilChanged()
             .subscribe(data => {
               this.addErrorIfSprintExist(control);
             });
  }

}
