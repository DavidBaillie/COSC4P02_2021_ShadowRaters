import { Component, HostBinding } from '@angular/core';

import { UpgradableComponent } from 'theme/components/upgradable';

@Component({
  selector: 'app-charts',
  styleUrls: ['./departments.component.scss'],
  templateUrl: './departments.component.html',
})
export class DepartmentsComponent extends UpgradableComponent {
  @HostBinding('class.mdl-grid') public readonly mdlGrid = true;
  @HostBinding('class.charts') public readonly charts = true;

  public data = [
    {
      name: 'Computer Science',
      description: 'Computer Science',
      rating: '4.6',
    },
    {
      name: 'Computer Science',
      description: 'Computer Science',
      rating: '4.6',
    },
    {
      name: 'Computer Science',
      description: 'Computer Science',
      rating: '4.6',
    },
    {
      name: 'Computer Science',
      description: 'Computer Science',
      rating: '4.6',
    },
    {
      name: 'Computer Science',
      description: 'Computer Science',
      rating: '4.6',
    },
    {
      name: 'Computer Science',
      description: 'Computer Science',
      rating: '4.6',
    },
    {
      name: 'Computer Science',
      description: 'Computer Science',
      rating: '4.6',
    },
    {
      name: 'Computer Science',
      description: 'Computer Science',
      rating: '4.6',
    },

  ];



}
