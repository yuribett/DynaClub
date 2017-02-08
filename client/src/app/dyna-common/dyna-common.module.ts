import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BooleanYesNoPipe } from './pipes/boolean-yes-no.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [ BooleanYesNoPipe],
  exports:      [ BooleanYesNoPipe]
})
export class DynaCommonModule { }
