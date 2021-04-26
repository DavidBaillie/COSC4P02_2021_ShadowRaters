import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from "@angular/router";
import {BlankLayoutCardComponent} from 'app/components/blank-layout-card';
import {AuthService} from "@services/*";

@Component({
  selector: 'app-change-password',
  styleUrls: ['../../../components/blank-layout-card/blank-layout-card.component.scss'],
  templateUrl: './change-password.component.html',
})

export class PasswordChangeComponent extends BlankLayoutCardComponent  implements OnInit {
  public changePasswordForm: FormGroup;
  public password;
  public re_password;
  public isSame: boolean;
  public error: string;
  public passPattern = '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{6,12}';

  constructor(public authService: AuthService, public fb: FormBuilder, public router: Router) {
    super();
    this.changePasswordForm = this.fb.group({
        password: new FormControl(null, [Validators.required]),
        re_password: new FormControl(null, [Validators.required])
      },
      {
        validator: MustMatch('password', 're_password')
      });

    this.password = this.changePasswordForm.get('password');
    this.re_password = this.changePasswordForm.get('re_password');

  }

  public ngOnInit() {
    this.changePasswordForm.valueChanges.subscribe(() => {
      this.error = null;
    });
  }

  public changePassword() {
    this.error = null;
    if (this.changePasswordForm.valid) {
      this.authService.changePassword(this.changePasswordForm.getRawValue())
        .subscribe(res => {
          if (res.msg != "success") {
            alert("Change password failed!");
          } else {
            alert("Change password success!");
            this.returnHome();
          }
        });
    }
  }


  //Check if confirm password is the same as password
  public checkConfirm() {
    // console.log("checked: "+ this.changePasswordForm.get('password').value +" " + this.changePasswordForm.get('re_password').value);
    this.isSame = (this.changePasswordForm.get('password').value == this.changePasswordForm.get('re_password').value);
    // console.log("same:"+this.isSame);
  }

  public returnHome() {
    this.router.navigate(['/app/home']);
  }

  //Whenever input is changed
  public onInputChange(event) {
    this.checkConfirm();
    event.target.required = true;
  }
}


//Problem: only activated when change input of the password field
export function MustMatch(controlName: string, matchingControlName: string) {
  return (formGroup: FormGroup) => {
    const control = formGroup.controls[controlName];
    const matchingControl = formGroup.controls[matchingControlName];

    if (matchingControl.errors && !matchingControl.errors.mustMatch) {
      return;
    }

    // set error on matchingControl if validation fails
    if (control.value !== matchingControl.value) {
      matchingControl.setErrors({mustMatch: true});
      console.log("not same！");
    } else {
      matchingControl.setErrors(null);
      console.log("same!");
    }
  }
}
