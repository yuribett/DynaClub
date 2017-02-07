import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BooleanYesNoPipe } from './pipes/boolean-yes-no.pipe';
import { FaIconComponent } from './icons/fa-icon/fa-icon.component'

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [ BooleanYesNoPipe, FaIconComponent],
  exports:      [ BooleanYesNoPipe, FaIconComponent]
})
export class DynaCommonModule { }
