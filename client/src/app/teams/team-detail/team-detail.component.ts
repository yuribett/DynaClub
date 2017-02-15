import { Component, OnInit, Input, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { TeamService } from '../team.service';
import { Team } from '../team';
import { TeamValidator } from './team.validator'

import { FieldErrorsComponent } from '../../dyna-common/field-errors/field-errors.component'

@Component({
  selector: 'app-team-detail',
  templateUrl: './team-detail.component.html',
  styleUrls: ['./team-detail.component.css']
})
export class TeamDetailComponent implements OnInit {
  
  teamForm: FormGroup;
  validator: TeamValidator = new TeamValidator();
  
  @Input() team: Team;
  error: any;
  
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private teamService: TeamService,
    private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.createEmptyForm();
    this.loadTeamForEdit();
  }

  loadTeamForEdit(): void {

    this.route.params.forEach((params: Params) => {
      if (params['id'] !== undefined) {
        let id = params['id'];
        this.teamService
            .findById(id)
            .then(team =>
              {
                this.team = team;
                this.setFormValues();
              }
            );
      } else {
        this.setFormValues();
      }
    });
  }

  createEmptyForm(): void {

    this.team = new Team();
    this.team.active = true;
    this.team.name = '';

    this.teamForm = this.fb.group({
      name: [this.team.name, [Validators.required, 
                              Validators.minLength(3)]],
      active: [this.team.active, [Validators.required]]
    });
  }

  setFormValues(): void {
    this.teamForm.setValue({
      name: this.team.name, 
      active: this.team.active
    });

    this.validator = new TeamValidator(this.teamForm, this.teamService, this.team);
  }

  setModelValues(formValues: Team): void {
     formValues._id = this.team._id;
     this.team = formValues;
  }

  onSubmit({ value, valid }: { value: Team, valid: boolean }) {
    if (valid){
      this.validator.clearErrors();
      this.save(value);
    } else {
      this.validator.showErrors();
    }
  }

  save(formValues: Team): void {
    this.setModelValues(formValues);
    this.teamService
        .save(this.team)
        .then(team => {
          this.goBack();
        })
        .catch(error  => this.error = error);
  }

  goBack(): void {
    this.router.navigateByUrl('/teams');
  }
}
