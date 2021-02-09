import { Component, Input } from '@angular/core';

import { SidebarComponent as BaseSidebarComponent } from 'theme/components/sidebar';

@Component({
  selector: 'app-sidebar',
  styleUrls: ['../../../theme/components/sidebar/sidebar.component.scss', './sidebar.component.scss'],
  templateUrl: '../../../theme/components/sidebar/sidebar.component.html',
})
export class SidebarComponent extends BaseSidebarComponent {
  public title = 'Rate Menu';
  public menu = [
    { name: 'Home Page', link: '/app/home', icon: 'home' },
    { name: 'Search Professor', link: '/app/professors', icon: 'person' },
    { name: 'Search Institution', link: '/app/institutions', icon: 'school' },
    { name: 'Search Department', link: '/app/departments', icon: 'business_centre' },
    { name: 'Search Course', link: '/app/courses', icon: 'subject' },
    { name: 'About us', link: '/app/about', icon: 'contact_support' }
  ];
}
