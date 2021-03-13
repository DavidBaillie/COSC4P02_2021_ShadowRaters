import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { UpgradableComponent } from 'theme/components/upgradable';

@Component({
  selector: 'search-course',
  styleUrls: ['./search-course.component.scss'],
  templateUrl: './search-course.component.html',
})
export class SearchCourse extends UpgradableComponent implements OnInit{
  allProfessors:Array<Object>;
  professors:Array<Object>;

  constructor(private router: Router) {
    super();
  }

  
  ngOnInit() {
    this.professors = [
      {
      name: "COSC 4P02",
      description: "Great course teaching you the fundamentals of software engineering.",
      school: "Broccoli University"
      },
      {
        name: "COSC 3P03",
        description: "The algorithms course.",
        school: "Broccoli University"
      },
      {
        name: "ESC 3P01",
        description: "Economy of the world.",
        school: "Stan Unviersity"
      },
      {
        name: "ESC 3P01",
        description: "Economy of the worlds.",
        school: "Stan University"
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
