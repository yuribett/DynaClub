import { SprintSearchComponent } from './sprint-search/sprint-search.component';
import { SprintSearchItemComponent } from './sprint-search-item/sprint-search-item.component';
import { SprintService } from '../../shared/services/sprint.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynaCommonModule } from '../../shared/dyna-common.module';
import { SprintDetailComponent } from './sprint-detail/sprint-detail.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  imports: [
    FormsModule, ReactiveFormsModule, CommonModule, DynaCommonModule
  ],
  exports: [SprintSearchComponent],
  declarations: [SprintSearchComponent, SprintSearchItemComponent, SprintDetailComponent],
  providers: [SprintService]
})
export class SprintModule { }
