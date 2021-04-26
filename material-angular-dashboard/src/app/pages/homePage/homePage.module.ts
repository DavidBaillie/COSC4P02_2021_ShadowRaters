import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SearchService } from '../search/search-general/search.service';

import { ThemeModule } from 'theme';

@NgModule({
  imports: [
    CommonModule,
    ThemeModule,
    FormsModule,
  ],
  declarations: [
  ],
  providers: [
    SearchService,
  ],
})
export class HomePageModule { }
