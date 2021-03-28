import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { UpgradableComponent } from 'theme/components/upgradable';
import {SearchCourseService} from './search-course.service'

@Component({
  selector: 'search-course',
  styleUrls: ['./search-course.component.scss'],
  templateUrl: './search-course.component.html',
  providers: [SearchCourseService],
})
export class SearchCourse extends UpgradableComponent implements OnInit{
  allProfessors:any;
  professors:any;

  constructor(private router: Router, private searchCourseService: SearchCourseService) {
    super();
  }


  ngOnInit() {
    this.getCourses();
  }

  private async getCourses() {
    const courses = await this.searchCourseService.getCourses();
    this.professors = courses.course;
    this.allProfessors =this.professors;
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
