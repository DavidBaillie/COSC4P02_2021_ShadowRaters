import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { UpgradableComponent } from 'theme/components/upgradable';

@Component({
  selector: 'search-professor',
  styleUrls: ['./search-professor.component.scss'],
  templateUrl: './search-professor.component.html',
})
export class SearchProfessor extends UpgradableComponent implements OnInit{
  allProfessors:Array<Object>;
  professors:Array<Object>;

  constructor(private router: Router) {
    super();
  }

  
  ngOnInit() {
    this.professors = [
      {
      name: "Professor Xavier",
      description: "Brainy dude",
      school: "School of Gifted Youngsters"
      },
      {
        name: "Prof Y",
        description: "Y doe",
        school: "Butte University"
      },
      {
        name: "Prof Z",
        description: "Zzz sleepy",
        school: "Z university"
      },
      {
        name: "Prof XY",
        description: "Excelent",
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
