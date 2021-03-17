import {Component, HostBinding} from '@angular/core';
import {Router} from '@angular/router';
import {UpgradableComponent} from 'theme/components/upgradable';

@Component({
  selector: 'app-dashboard',
  styleUrls: ['../departments/departments.component.scss', '../../../theme/scss/centre.scss'],
  templateUrl: './dashboard.component.html',
})

export class DashboardComponent extends UpgradableComponent {
  @HostBinding('class.mdl-grid') public readonly mdlGrid = true;
  @HostBinding('class.mdl-grid--no-spacing') public readonly mdlGridNoSpacing = true;

  constructor(private router: Router) {
    super();

  }

  route_search_prof = function () {
    this.router.navigateByUrl('/app/professors');
  };

  route_search_institution = function () {
    this.router.navigateByUrl('/app/institutions');
  };
}

