import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '@services/*';

@Component({
  selector: 'app-common-layout',
  templateUrl: './common-layout.component.html',
})
export class CommonLayoutComponent implements OnInit {

  public user;
  public userSpace;

  constructor(private authService: AuthService,
              private router: Router) {}

  public ngOnInit() {
    this.userSpace = document.getElementById('user-space');
    this.authService.userData.subscribe(user => this.user = user ? user : {
      username: 'Luke',
      email: 'Luke@skywalker.com',
    });
    if (!this.authService.isLoggedIn) 
      this.createSignIn();
    else
      this.createUserIcon();
  }

  public logout() {
    this.authService.logout()
      .subscribe(
        res => {
          const accountIcon = document.getElementById('icon');
          accountIcon.remove();
          this.createSignIn();
        });
  }


  private createUserIcon() {
    const userIcon = document.createElement("div");
    const span = document.createElement("span");
    const imgTag = document.createElement("img");
    userIcon.setAttribute("class", "avatar-dropdown");
    userIcon.setAttribute("id", "icon");
    span.innerText = this.user.username;
    imgTag.setAttribute("src", "assets/images/Icon_header.png");
    userIcon.append(span);
    userIcon.append(imgTag);
    this.userSpace.append(userIcon);
  }

  private createSignIn() {
    const signInUpTag = document.createElement("div");
    const signIn = document.createElement("button");
    signIn.className = "mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect";
    // signIn.onclick = () => this.router.navigate(['/pages/login']);
    signIn.onclick = () => this.router.navigateByUrl("/pages/login");

    signIn.innerText = "Sign in";
    signInUpTag.append(signIn);
    this.userSpace.append(signInUpTag);
  }
}
