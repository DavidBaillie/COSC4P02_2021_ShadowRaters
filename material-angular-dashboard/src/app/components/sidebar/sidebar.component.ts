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
    { name: 'Search Professor', link: '/app/search/professors', icon: 'person' },
    { name: 'Search Institution', link: '/app/search/institutions', icon: 'school' },
    { name: 'Search Department', link: '/app/search/departments', icon: 'business_centre' },
    { name: 'Search Course', link: '/app/search/courses', icon: 'subject' },
    { name: 'About us', link: '/app/about', icon: 'contact_support' }
  ];
}
