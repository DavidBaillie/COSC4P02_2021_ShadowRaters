import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InstitutionDetailsComponent } from './institutionDetails.component';

import { ThemeModule } from 'theme';

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
  ],
})
export class InstitutionDetailsModule { }
