import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {DetailInstitutionComponent} from './detail-institution.component';
import {DiscreteBarChartComponent} from "./discrete-bar-chart";
import {LineChartComponent} from "./line-chart";

import {ThemeModule} from 'theme';

@NgModule({
  imports: [
    CommonModule,
    ThemeModule,
    FormsModule,
  ],
  exports: [
    DetailInstitutionComponent,
  ],
  declarations: [
    DetailInstitutionComponent,
    DiscreteBarChartComponent,
    LineChartComponent,
  ],
})
export class DetailInstitutionModule {
}
