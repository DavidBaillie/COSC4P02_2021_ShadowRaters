import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {InstitutionDetailsComponent} from './institutionDetails.component';
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
    InstitutionDetailsComponent,
  ],
  declarations: [
    InstitutionDetailsComponent,
    DiscreteBarChartComponent,
    LineChartComponent,
  ],
})
export class InstitutionDetailsModule {
}
