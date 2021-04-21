import { Component } from '@angular/core';

import { UpgradableComponent } from 'theme/components/upgradable';

@Component({
  selector: 'app-forms',
  template: `
    <app-change-password-form></app-change-password-form>`,
})
export class ChangePasswordComponent extends UpgradableComponent { }
