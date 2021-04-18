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
    this.aboutUs = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse vel lacinia dolor, 
    id consequat nunc. Donec tortor lacus, semper sed facilisis vel, interdum in enim. Etiam at augue vestibulum, 
    aliquam eros eu, sollicitudin arcu. Donec luctus massa eu nisi lobortis hendrerit. Vivamus vulputate ipsum a justo lobortis, 
    sit amet congue turpis suscipit. Integer in ex semper, laoreet nisi porttitor, porttitor tortor. Morbi nec sem metus. 
    In lobortis quam lobortis velit dignissim, eu ultrices lorem posuere. In ante mi, tincidunt nec commodo ut, facilisis vitae ex. 
    Proin erat metus, ullamcorper at aliquam non, volutpat quis tellus. Maecenas id vestibulum tellus, a condimentum mauris. 
    Nullam sed posuere erat. Pellentesque accumsan sapien vitae erat tristique, eu viverra urna bibendum. Nullam nec lacus a 
    ipsum interdum egestas. Nullam nec ante nec metus vestibulum posuere.

    Aliquam id mauris in quam sollicitudin laoreet. Sed eros tellus, commodo vitae rhoncus nec, semper ac nulla. 
    Sed placerat mattis ipsum vitae vehicula. Vivamus eget felis molestie, consectetur lacus non, ultrices ante. 
    Duis ullamcorper est ipsum, eget porttitor arcu viverra vel. Phasellus a nulla aliquet, vehicula neque ut, dapibus sem.
     Fusce vitae lacus in libero molestie lobortis. Aliquam in velit dapibus, auctor mauris ut, malesuada augue. Suspendisse 
     lorem orci, pharetra ultricies purus at, egestas tempus urna. Nullam feugiat tincidunt tellus, nec vehicula ex. Nunc id
     felis sed lorem porta venenatis. Proin rhoncus justo et purus hendrerit dignissim.
    
    Ut lobortis quam varius turpis tempus vestibulum. Aenean blandit malesuada ante ut tincidunt. Nunc vitae faucibus metus. 
    Nulla quam enim, rhoncus non turpis ac, porttitor venenatis lectus. Maecenas eleifend odio sit amet convallis tristique.
     Nullam vitae porttitor nibh, vel venenatis lacus. Suspendisse potenti. Nam a lacus ut ipsum faucibus lacinia a quis arcu. 
     Pellentesque tincidunt id diam eu blandit. Morbi sed ipsum sem. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      Ut gravida dictum sapien vitae elementum. Suspendisse maximus nisl in tellus suscipit, eget mollis ligula fermentum.
    
    Nulla pellentesque eros at nisl aliquam pretium. Vestibulum sollicitudin ac justo non fringilla. Nam luctus, 
    ligula id pharetra tincidunt, mauris sapien malesuada arcu, sit amet molestie diam eros quis quam. Aenean et
     justo ut nunc vestibulum aliquam. Quisque fringilla, lorem et dignissim aliquam, quam leo hendrerit nulla, 
     vel finibus dui ante vitae urna. Duis a posuere nulla. Phasellus quis magna sed velit sollicitudin iaculis.
      Sed viverra nibh ac turpis luctus pharetra. Aenean dignissim, tortor a fringilla mattis, ligula felis consequat ligula,
       vel ullamcorper ipsum odio eget ipsum. Fusce vulputate elementum eleifend. Nulla odio ex, dapibus at nulla vitae, eleifend 
       ultricies massa. Maecenas finibus consectetur est, quis tempus quam luctus eget. Class aptent taciti sociosqu ad litora 
       torquent per conubia nostra, per inceptos himenaeos. Curabitur maximus malesuada est ut dignissim. Vivamus nec pharetra ipsum.`
  }

}
