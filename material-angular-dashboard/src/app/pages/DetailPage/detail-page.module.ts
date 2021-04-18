import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {DetailsComponent} from './detail-page.component';
import {DiscreteBarChartComponent} from "./discrete-bar-chart";
import {LineChartComponent} from "./line-chart";
import {ThemeModule} from 'theme';
import {StarRatingComponent} from './stars/stars.component';
import {MiniSearchComponent} from './mini-search/mini-search.component';

@NgModule({
  imports: [
    CommonModule,
    ThemeModule,
    FormsModule,
  ],
  exports: [
    DetailsComponent,
  ],
  declarations: [
    DetailsComponent,
    DiscreteBarChartComponent,
    LineChartComponent,
    StarRatingComponent,
    MiniSearchComponent,
  ],
})
export class DetailsModule {
}
