import { Component, HostBinding } from '@angular/core';

import { BlankLayoutCardComponent } from 'app/components/blank-layout-card';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "@services/*";
import {Router} from "@angular/router";

@Component({
  selector: 'app-forgot-password',
  styleUrls: ['../../../components/blank-layout-card/blank-layout-card.component.scss'],
  templateUrl: './forgot-password.component.html',
})
export class ForgotPasswordComponent extends BlankLayoutCardComponent {

  public recoverPasswordForm: FormGroup;
  public username;
  public email;
  public emailPattern = '^([a-zA-Z0-9_\\-\\.]+)@([a-zA-Z0-9_\\-\\.]+)\\.([a-zA-Z]{2,5})$';
  public error: string;

  constructor(public authService: AuthService,
              public fb: FormBuilder,
              public router: Router) {
    super();

    this.recoverPasswordForm = this.fb.group({
      username: new FormControl('', Validators.required),
      email: new FormControl('', [
        Validators.required]),
    });
    this.username = this.recoverPasswordForm.get('username');
    this.email = this.recoverPasswordForm.get('email');
  }

  public ngOnInit() {
    this.authService.logout();
    this.recoverPasswordForm.valueChanges.subscribe(() => {
      this.error = null;
    });
  }

  public sendRecoverEmail() {
    this.error = null;
    if (this.recoverPasswordForm.valid) {
      this.authService.sendRecoverEmail(this.recoverPasswordForm.getRawValue())
        .subscribe(res => {
            if (res.msg == 'success') {
              alert("Recover email sent! Please check your email box!");
              this.router.navigate(['/app/home']);
            } else this.error = res.msg;
          },
          error => this.error = error.message
        );
    }
  }

  public onInputChange(event) {
    event.target.required = true;
  }
}


