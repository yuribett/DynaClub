import { TeamSearchComponent } from './team-search/team-search.component';
import { TeamSearchItemComponent } from './team-search-item/team-search-item.component';
import { TeamService } from '../../shared/services/team.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynaCommonModule } from '../../shared/dyna-common.module';
import { TeamDetailComponent } from './team-detail/team-detail.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  imports: [
    FormsModule, ReactiveFormsModule, CommonModule, DynaCommonModule
  ],
  exports: [TeamSearchComponent],
  declarations: [TeamSearchComponent, TeamSearchItemComponent, TeamDetailComponent],
  providers: [TeamService]
})
export class TeamModule { }
