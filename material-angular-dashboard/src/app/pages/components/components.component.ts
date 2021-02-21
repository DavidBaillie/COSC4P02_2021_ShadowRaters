import { Component, HostBinding } from '@angular/core';
import { UpgradableComponent } from 'theme/components/upgradable';


@Component({
  selector: 'app-components',
  templateUrl: './components.component.html',
  styleUrls: ['./components.component.scss'],
})
export class ComponentsComponent extends UpgradableComponent {
  @HostBinding('class.mdl-grid') public readonly mdlGrid = true;
  @HostBinding('class.ui-components') public readonly uiComponents = true;


  //temp data
  public data = [
    {
      name: 'Brock University',
      description: 'Brock University',
      image: 'brock.jpg',
    },
    {
      name: 'Brock University',
      description: 'Brock University',
      image: 'brock.jpg',
    },
    {
      name: 'Brock University',
      description: 'Brock University',
      image: 'brock.jpg',
    },
    {
      name: 'Brock University',
      description: 'Brock University',
      image: 'brock.jpg',
    },
    {
      name: 'Brock University',
      description: 'Brock University',
      image: 'brock.jpg',
    },
    {
      name: 'Brock University',
      description: 'Brock University',
      image: 'brock.jpg',
    },
    {
      name: 'Brock University',
      description: 'Brock University',
      image: 'brock.jpg',
    },
    {
      name: 'Brock University',
      description: 'Brock University',
      image: 'brock.jpg',
    },
    {
      name: 'Brock University',
      description: 'Brock University',
      image: 'brock.jpg',
    },
    {
      name: 'Brock University',
      description: 'Brock University',
      image: 'brock.jpg',
    },
    {
      name: 'Brock University',
      description: 'Brock University',
      image: 'brock.jpg',
    },
    {
      name: 'Brock University',
      description: 'Brock University',
      image: 'brock.jpg',
    },
    {
      name: 'Brock University',
      description: 'Brock University',
      image: 'brock.jpg',
    },
    {
      name: 'Brock University',
      description: 'Brock University',
      image: 'brock.jpg',
    },
    {
      name: 'Brock University',
      description: 'Brock University',
      image: 'brock.jpg',
    },
  ];

}
