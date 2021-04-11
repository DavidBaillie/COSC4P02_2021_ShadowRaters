import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MaterialAngularSelectModule } from 'material-angular-select';
import { ThemeModule } from 'theme';
import { DashboardModule } from '../../dashboard/dashboard.module';
import { RouterModule } from '@angular/router';
import { Search } from './search.component';

@NgModule({
  imports: [
    CommonModule,
    ThemeModule,
    FormsModule,
    DashboardModule,
    MaterialAngularSelectModule,
    RouterModule,
  ],
  declarations: [
    Search,
    // FiltersComponent,
  ],
  exports: [
    Search,
  ]
})
export class SearchModule {}
