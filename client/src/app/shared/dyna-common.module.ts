import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BooleanYesNoPipe } from './pipes/boolean-yes-no.pipe';
import { FieldErrorsComponent } from './components/field-errors/field-errors.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [ BooleanYesNoPipe, FieldErrorsComponent],
  exports:      [ BooleanYesNoPipe, FieldErrorsComponent]
})
export class DynaCommonModule { }
