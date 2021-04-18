import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MaterialAngularSelectModule } from 'material-angular-select';
import { ThemeModule } from 'theme';
import { HomePageModule } from '../../homePage/homePage.module';
import { RouterModule } from '@angular/router';
import { SearchDepartment } from './search-department.component';
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
    SearchDepartment,
  ],
})
export class SearchDepartmentModule {}
