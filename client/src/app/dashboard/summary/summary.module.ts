import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SummaryComponent } from './summary.component';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [SummaryComponent],
  declarations: [SummaryComponent],
})
export class SummaryModule { }
