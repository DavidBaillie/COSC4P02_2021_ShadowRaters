import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// import { Console } from 'console';
import { UpgradableComponent } from 'theme/components/upgradable';
import {SearchProfessorService} from './search-professor.service';
import { Observable, throwError } from 'rxjs';
import {IProfessor} from './professor';


@Component({
  selector: 'search-professor',
  styleUrls: ['./search-professor.component.scss'],
  templateUrl: './search-professor.component.html',
  providers: [SearchProfessorService],
})
export class SearchProfessor extends UpgradableComponent implements OnInit{
  allProfessors:IProfessor[];
  professors:IProfessor[];

  constructor(private router: Router, private searchProfessorService: SearchProfessorService) {
    super();
  }

  ngOnInit() {
    this.getProfessors();
  }

  private async getProfessors() {
    const professors = await this.searchProfessorService.getProfessors();
    this.professors = professors.professor
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

  public goToProf(parameter:string) {
    const profURL:string = '/app/professorX/' + parameter;
    console.log(profURL);
    this.router.navigate([profURL]);
  }

}
