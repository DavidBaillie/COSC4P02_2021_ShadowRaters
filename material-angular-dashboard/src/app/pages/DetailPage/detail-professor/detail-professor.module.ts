import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {DetailProfessorComponent} from './detail-professor.component';
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
    DetailProfessorComponent,
  ],
  declarations: [
    DetailProfessorComponent,
    DiscreteBarChartComponent,
    LineChartComponent,
  ],
})
export class DetailProfessorModule {
}
