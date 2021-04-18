import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MaterialAngularSelectModule } from 'material-angular-select';
import { ThemeModule } from 'theme';
import { HomePageModule } from '../../homePage';
import { RouterModule } from '@angular/router';
import { SearchCourse } from './search-course.component';
import {SearchModule} from '../search-general'

@NgModule({
  imports: [
    CommonModule,
    ThemeModule,
    FormsModule,
    HomePageModule,
    MaterialAngularSelectModule,
    RouterModule,
    SearchModule,
  ],
  declarations: [
    SearchCourse,
  ],
})
export class SearchCourseModule {}
