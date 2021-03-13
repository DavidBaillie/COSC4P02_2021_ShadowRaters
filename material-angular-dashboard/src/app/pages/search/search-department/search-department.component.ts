import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { UpgradableComponent } from 'theme/components/upgradable';

@Component({
  selector: 'search-department',
  styleUrls: ['./search-department.component.scss'],
  templateUrl: './search-department.component.html',
})
export class SearchDepartment extends UpgradableComponent implements OnInit{
  allProfessors:Array<Object>;
  professors:Array<Object>;

  constructor(private router: Router) {
    super();
  }

  
  ngOnInit() {
    this.professors = [
      {
      name: "Computer Science",
      description: "A lot of broccoli",
      school: "School of Gifted Youngsters"
      },
      {
        name: "Biological Sciences",
        description: "The university of Waterloo",
        school: "Butte University"
      },
      {
        name: "Statistics",
        description: "The university of Toronto",
        school: "Z university"
      },
      {
        name: "English",
        description: "Exciting",
        school: "Talent University"
      },
    ]
    this.allProfessors = this.professors;
  }


  public filterP() {
    const profName:string = (<HTMLInputElement> document.getElementById("prof")).value;
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

  public goToProf() {
    this.router.navigate(['/app/professorX']);
  }
  
}
