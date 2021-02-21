import { Component, HostBinding } from '@angular/core';
import { UpgradableComponent } from 'theme/components/upgradable';


@Component({
  selector: 'app-institutionDetails',
  templateUrl: './institutionDetails.component.html',
  styleUrls: ['./institutionDetails.component.scss'],
})
export class InstitutionDetailsComponent extends UpgradableComponent {
  @HostBinding('class.mdl-grid') public readonly mdlGrid = true;
  @HostBinding('class.ui-components') public readonly uiComponents = true;

  public data = [
    {
      name: 'institution test',
      description: 'Brock University',
      image: 'brock.jpg',
    },
  ];


}
