import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { UpgradableComponent } from 'theme/components/upgradable';

@Component({
  selector: 'search-professor',
  styleUrls: ['./search-institution.component.scss'],
  templateUrl: './search-institution.component.html',
})
export class SearchInstitution extends UpgradableComponent implements OnInit{
  allProfessors:Array<Object>;
  professors:Array<Object>;

  constructor(private router: Router) {
    super();
  }


  ngOnInit() {
    this.professors = [
      {
      name: "Broccoli University",
      description: "A lot of broccoli",
      school: "School of Gifted Youngsters"
      },
      {
        name: "University of Waterloo",
        description: "The university of Waterloo",
        school: "Butte University"
      },
      {
        name: "University of Toronto",
        description: "The university of Toronto",
        school: "Z university"
      },
      {
        name: "University X",
        description: "Exciting",
        school: "Talent University"
      },
    ]
    this.allProfessors = this.professors;
  }


  public filterP() {
    const profName:string = (<HTMLInputElement> document.getElementById("school")).value;
    var s1:string;
    var s2:string = profName.toLowerCase().replace(/\s/g, "");

    if (s2 == "") {
      this.professors = this.allProfessors;
      return;
    }

    this.professors = this.allProfessors.filter( (prof:any) => {
      s1 = prof.name.toLowerCase().replace(/\s/g, "");
      return s1.toLowerCase().includes(s2);
    });
  }

  public gotoInsti() {
    this.router.navigate(['/app/institutionX']);
  }

}
