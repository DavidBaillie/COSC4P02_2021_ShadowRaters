import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MaterialAngularSelectModule } from 'material-angular-select';
import { ThemeModule } from 'theme';

import { DepartmentsModule } from '../../departments/departments.module';
import { DashboardModule } from '../../dashboard/dashboard.module';
import { RouterModule } from '@angular/router';

import { SearchProfessor } from './search-professor.component';
// import { FiltersComponent } from './filters/filters.component';

@NgModule({
  imports: [
    CommonModule,
    ThemeModule,
    FormsModule,
    DashboardModule,
    DepartmentsModule,
    MaterialAngularSelectModule,
    RouterModule,
  ],
  declarations: [
    SearchProfessor,
    // FiltersComponent,
  ],
})
export class SearchProfessorModule {}
