import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ThemeModule } from 'theme';

import { CotoneasterCardComponent } from './cotoneaster-card';
import { HomePageComponent } from './homePage.component';
import { LineChartComponent } from './line-chart';
import { PieChartComponent } from './pie-chart';
import { RobotCardComponent } from './robot-card';
import { TableCardComponent } from './table-card';
import { TodoListComponent } from './todo-list';
import { TrendingComponent } from './trending';

@NgModule({
  imports: [
    CommonModule,
    ThemeModule,
    FormsModule,
  ],
  declarations: [
    HomePageComponent,
    LineChartComponent,
    PieChartComponent,
    CotoneasterCardComponent,
    TableCardComponent,
    RobotCardComponent,
    TodoListComponent,
    TrendingComponent,
  ],
  exports: [
    TrendingComponent,
  ],
})
export class HomePageModule { }
