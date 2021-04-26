import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {BlankLayoutCardComponent} from 'app/components/blank-layout-card';
import {AuthService} from '../../../services/auth';

@Component({
  selector: 'app-login',
  styleUrls: ['../../../components/blank-layout-card/blank-layout-card.component.scss'],
  templateUrl: './login.component.html',
})
export class LoginComponent extends BlankLayoutCardComponent implements OnInit {
  public loginForm: FormGroup;
  public username;
  public password;
  // public emailPattern = '^([a-zA-Z0-9_\\-\\.]+)@([a-zA-Z0-9_\\-\\.]+)\\.([a-zA-Z]{2,5})$';
  public usernamePattern = "[A-Za-z0-9]+";
  public error: string;

  constructor(public authService: AuthService,
              public fb: FormBuilder,
              public router: Router) {
    super();

    this.loginForm = this.fb.group({
      password: new FormControl('', Validators.required),
      username: new FormControl('', [
        Validators.required,
        Validators.pattern(this.usernamePattern),
        Validators.maxLength(15),
      ]),
    });
    this.username = this.loginForm.get('username');
    this.password = this.loginForm.get('password');
  }

  public ngOnInit() {
    this.authService.logout();
    this.loginForm.valueChanges.subscribe(() => {
      this.error = null;
    });
  }

  public login() {
    this.error = null;
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.getRawValue())
        .subscribe(res => {
            if (res.msg == 'login success') {
              alert("Login success! Redirecting to home page!");
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
