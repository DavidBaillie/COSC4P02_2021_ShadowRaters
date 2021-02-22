import { Component, HostBinding } from '@angular/core';
import { UpgradableComponent } from 'theme/components/upgradable';


@Component({
  selector: 'app-components',
  templateUrl: './institutions.component.html',
  styleUrls: ['./institutions.component.scss'],
})
export class ComponentsComponent extends UpgradableComponent {
  @HostBinding('class.mdl-grid') public readonly mdlGrid = true;
  @HostBinding('class.ui-components') public readonly uiComponents = true;


  //temp data
  public data = [
    {
      name: 'Brock University',
      description: 'Brock University',
      rating: '4.8',
    },
    {
      name: 'Brock University',
      description: 'Brock University',
      rating: '4.8',
    },
    {
      name: 'Brock University',
      description: 'Brock University',
      rating: '4.8',
    },
    {
      name: 'Brock University',
      description: 'Brock University',
      rating: '4.8',
    },
    {
      name: 'Brock University',
      description: 'Brock University',
      rating: '4.8',
    },
    {
      name: 'Brock University',
      description: 'Brock University',
      rating: '4.8',
    },
    {
      name: 'Brock University',
      description: 'Brock University',
      rating: '4.8',
    },
    {
      name: 'Brock University',
      description: 'Brock University',
      rating: '4.8',
    },
    {
      name: 'Brock University',
      description: 'Brock University',
      rating: '4.8',
    },
    {
      name: 'Brock University',
      description: 'Brock University',
      rating: '4.8',
    },
    {
      name: 'Brock University',
      description: 'Brock University',
      rating: '4.8',
    },
    {
      name: 'Brock University',
      description: 'Brock University',
      rating: '4.8',
    },
    {
      name: 'Brock University',
      description: 'Brock University',
      rating: '4.8',
    },
    {
      name: 'Brock University',
      description: 'Brock University',
      rating: '4.8',
    },
    {
      name: 'Brock University',
      description: 'Brock University',
      rating: '4.8',
    },
  ];

}
