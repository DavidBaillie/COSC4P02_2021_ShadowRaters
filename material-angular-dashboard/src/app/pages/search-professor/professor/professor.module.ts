import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MaterialAngularSelectModule } from 'material-angular-select';
import { ThemeModule } from 'theme';

import { DepartmentsModule } from '../../departments/departments.module';
import { DashboardModule } from '../../dashboard/dashboard.module';
import { ProfessorComponent } from './professor.component';
import { RatingsComponent } from '../../ratingStuff/ratings/ratings.component';
import { LineChartComponent } from './../line-chart';
import { DiscreteBarChartComponent } from './../discrete-bar-chart';

@NgModule({
  imports: [
    CommonModule,
    ThemeModule,
    FormsModule,
    DashboardModule,
    DepartmentsModule,
    MaterialAngularSelectModule,
  ],
  declarations: [
    ProfessorComponent,
    RatingsComponent,
    LineChartComponent,
    DiscreteBarChartComponent,
  ],
})
export class ProfessorModule {}
