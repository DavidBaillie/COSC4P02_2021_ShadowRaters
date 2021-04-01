import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MaterialAngularSelectModule } from 'material-angular-select';
import { ThemeModule } from 'theme';
import { AboutComponent } from './about.component';

import { TeamMemberComponent } from './team-member/team-member.component';

@NgModule({
  imports: [
    CommonModule,
    ThemeModule,
    FormsModule,
    MaterialAngularSelectModule,
  ],
  declarations: [
    AboutComponent,
    TeamMemberComponent,
  ],
})
export class AboutModule {}
