import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RankingComponent } from './ranking.component';
import { RankingSearchComponent } from './ranking-search/ranking-search.component';
import { RankingService } from './ranking.service';
import { FormsModule  } from '@angular/forms';
import { RankingDetailComponent } from './ranking-detail/ranking-detail.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [RankingComponent, RankingSearchComponent, RankingDetailComponent],
  exports: [RankingComponent],
  providers: [RankingService]

})
export class RankingModule { }
