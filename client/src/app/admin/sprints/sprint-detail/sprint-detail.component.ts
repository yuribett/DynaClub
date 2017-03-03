import { Component, OnInit, Input, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
 
import { ActivatedRoute, Params, Router } from '@angular/router';
import { CustomValidators } from 'ng2-validation';
import { SprintService } from '../../../shared/services/sprint.service';
import { Sprint } from '../../../shared/models/sprint';
import { SprintValidator } from './sprint.validator'

import { FieldErrorsComponent } from '../../../shared/components/field-errors/field-errors.component'

@Component({
  selector: 'app-sprint-detail',
  templateUrl: './sprint-detail.component.html',
  styleUrls: ['./sprint-detail.component.css']
})
export class SprintDetailComponent implements OnInit {
  
  title: String;
  sprintForm: FormGroup;
  validator: SprintValidator = new SprintValidator();
  
  @Input() sprint: Sprint;
  error: any;
  
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private sprintService: SprintService,
    private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.createEmptyForm();
    this.loadSprintForEdit();
  }

  loadSprintForEdit(): void {

    this.route.params.forEach((params: Params) => {
      if (params['id'] !== undefined) {
        let id = params['id'];
        this.sprintService
            .findById(id)
            .then(sprint =>
              {
                this.sprint = sprint;
                this.setFormValues();
              }
            );
      } else {
        this.setFormValues();
      }
    });
  }

  createEmptyForm(): void {

    this.sprint = new Sprint();
    this.sprint.dateStart = null;
    this.sprint.dateFinish = null;
    this.sprint.initialAmount = null;

    this.sprintForm = this.fb.group({
      dateStart: [this.sprint.dateStart, [Validators.required]],
      dateFinish: [this.sprint.dateFinish, [Validators.required]],
      initialAmount: [this.sprint.initialAmount, [Validators.required, CustomValidators.gt(0)]]
    });
  }

  setTitle(): void {
    if (this.sprint._id){
      this.title = "Editar período";
    } else {
      this.title = "Inserir período";
    }
  }

  setFormValues(): void {
    
    this.setTitle();

    this.sprintForm.setValue({
      dateStart: this.sprint.dateStart, 
      dateFinish: this.sprint.dateFinish,
      initialAmount: this.sprint.initialAmount
    });

    this.validator = new SprintValidator(this.sprintForm, this.sprintService, this.sprint);
  }

  setModelValues(formValues: Sprint): void {
     formValues._id = this.sprint._id;
     this.sprint = formValues;

     const dateStart = new Date(this.sprint.dateStart + "T00:00:00.000Z")
     this.sprint.dateStart = new Date(dateStart.getTime() + dateStart.getTimezoneOffset() * 60000);
     const dateFinish = new Date(this.sprint.dateFinish + "T23:59:59.999Z")
     this.sprint.dateFinish = new Date(dateFinish.getTime() + dateFinish.getTimezoneOffset() * 60000);
  }

  onSubmit({ value, valid }: { value: Sprint, valid: boolean }) {
    if (valid){
      this.validator.clearErrors();
      this.save(value);
    } else {
      this.validator.showErrors();
    }
  }

  save(formValues: Sprint): void {
    this.setModelValues(formValues);

    this.sprintService
        .save(this.sprint)
        .then(sprint => {
          this.goBack();
        })
        .catch(error  => this.error = error);
  }

  goBack(): void {
    this.router.navigateByUrl('/sprints');
  }
}
