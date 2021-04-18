import {Component, HostBinding} from '@angular/core';
import {Router} from '@angular/router';
import {UpgradableComponent} from 'theme/components/upgradable';

@Component({
  selector: 'app-homePage',
  styleUrls: ['../../../theme/scss/centre.scss'],
  templateUrl: './homePage.component.html',
})

export class HomePageComponent extends UpgradableComponent {
  @HostBinding('class.mdl-grid') public readonly mdlGrid = true;
  @HostBinding('class.mdl-grid--no-spacing') public readonly mdlGridNoSpacing = true;

  constructor(private router: Router) {
    super();
  }

  route_search_prof = function () {
    this.router.navigateByUrl('/app/search/professors');
  };

  route_search_institution = function () {
    this.router.navigateByUrl('/app/search/institutions');
  };

  route_search_course = function () {
    this.router.navigateByUrl('/app/search/courses');
  };

}

