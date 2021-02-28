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
      name: 'Brock University',
      rating: '4.8',
    },
  ];


  public data_comments = [
    {
      userID:'Mathieu Cote',
      comment:'I think we did a Pretty Good job so far!',
      rating:'4.5',
    },
    {
      userID:'Spongebob',
      comment:'Always follow your heart – unless your heart is bad with directions!',
      rating:'5.0',
    },
    {
      userID:'Squidward',
      comment:"It would be if I didn't have to go to work.",
      rating:'3.8',
    },
  ];

}
