import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { UpgradableComponent } from 'theme/components/upgradable';
import {SearchCourseService} from './search-course.service'
import {ICourses} from "./courses";

@Component({
  selector: 'search-course',
  styleUrls: ['./search-course.component.scss'],
  templateUrl: './search-course.component.html',
  providers: [SearchCourseService],
})
export class SearchCourse extends UpgradableComponent implements OnInit{
  allCourses:ICourses[];
  courses:ICourses[];

  constructor(private router: Router, private searchCourseService: SearchCourseService) {
    super();
  }


  ngOnInit() {
    this.getCourses();
  }

  private async getCourses() {
    const temp = await this.searchCourseService.getCourses();
    this.courses = temp.course;
    this.allCourses =this.courses;
  }

  public filterCourses() {
    const profName:string = (<HTMLInputElement> document.getElementById("course")).value;
    var s1:string;
    var s2:string = profName.toLowerCase().replace(/\s/g, "");

    if (s2 == "") {
      this.courses = this.allCourses;
      return;
    }

    this.courses = this.allCourses.filter( (course:any) => {
      s1 = course.name.toLowerCase().replace(/\s/g, "");
      return s1.toLowerCase().includes(s2);
    });
  }

  public goToCourseX() {
    this.router.navigate(['/app/professorX']);
  }

}
