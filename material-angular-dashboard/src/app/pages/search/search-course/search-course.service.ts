import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable()
export class SearchCourseService {
    coursesURL = "http://database.ratemyscholar.ca/course";

    constructor(private http: HttpClient) {}

    /** GET courses */
    async getCourses() {
      const res = await this.http.get<any>(this.coursesURL).toPromise();
      // console.log("testing courses");
      // console.log(res);
      return res;
    }
}
