import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '@services/*';

@Component({
  selector: 'app-common-layout',
  templateUrl: './common-layout.component.html',
  styleUrls: ['./common-layout.scss'],
  encapsulation: ViewEncapsulation.None,

})
export class CommonLayoutComponent implements OnInit {

  public user;
  public userSpace;

  isBannerHidden:boolean = true;
  isSignInHidden:boolean = true;

  initial:string;

  constructor(private authService: AuthService,
              private router: Router) {
  }

  public ngOnInit() {
    this.userSpace = document.getElementById('user-space');
    this.authService.userData.subscribe(user => this.user = user ? user : {
      username: user.username,
      email: user.email,
      uuid: user.uuid,
      token: user.token,
    });
    if (localStorage.getItem("uuid") == undefined) {
      this.showSignInButton();
    } else {
      this.showUserBanner();
    }
  }


  route_account_management = function () {
    this.router.navigateByUrl('/app/change_password');
  };

  public logout() {
    if (confirm("Are you sure you want to log out?")) {
      this.authService.logout();
      const accountIcon = document.getElementById('icon');
      accountIcon.remove();
      this.showSignInButton();
      // window.location.reload();
      this.returnHome();
    }
  }

  public returnHome() {
    this.router.navigate(['/app/home']);
  }


  //Once user is logged in, display user banner
  private showUserBanner() {
    this.initial = localStorage.getItem("username").charAt(0).toUpperCase();
    this.isBannerHidden = false;
  }

  //If not logged in, show login button
  private showSignInButton() {
    this.isSignInHidden = false;
  }

  public signIn(){
    this.router.navigateByUrl("/pages/login");
  }

}
