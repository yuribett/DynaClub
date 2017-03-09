import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RankingComponent } from './ranking.component';
import { RankingSearchComponent } from './ranking-search/ranking-search.component';
import { RankingService } from './ranking.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [RankingComponent, RankingSearchComponent],
  exports: [RankingComponent],
  providers: [RankingService]

})
export class RankingModule { }
