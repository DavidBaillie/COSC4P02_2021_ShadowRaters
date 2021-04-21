import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule as NgFormsModule, ReactiveFormsModule} from '@angular/forms';
import {MaterialAngularSelectModule} from 'material-angular-select';

import {ThemeModule} from 'theme';

import {PasswordFormComponent} from './form';
import {ChangePasswordComponent} from './change-password.component';
import {BrowserModule} from "@angular/platform-browser";

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    ThemeModule,
    NgFormsModule,
    MaterialAngularSelectModule,
    ReactiveFormsModule,
  ],
  declarations: [
    ChangePasswordComponent,
    PasswordFormComponent,
  ],
  providers: [],
})
export class FormsModule {
}
