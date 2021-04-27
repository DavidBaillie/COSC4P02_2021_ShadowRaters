import { Component, OnInit } from '@angular/core';

import { UpgradableComponent } from 'theme/components/upgradable';

@Component({
  selector: 'about-page',
  styleUrls: ['./about.component.scss'],
  templateUrl: './about.component.html',
})
export class AboutComponent extends UpgradableComponent implements OnInit {
  members: Array<string>;
  aboutUs: string;

  ngOnInit() {
    this.members = ["Liam Baillie", "Tianci Yang", "Rodrigo Vega Jimenez", 
                    "Shunhua Wu", "Yichi Zhang", "Brandon Cheshire", "Owen Shanks", "Jake Varga"]
  }

}
