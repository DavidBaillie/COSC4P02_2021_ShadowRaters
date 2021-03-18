import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable()
export class SearchCourseService {
    professorsURL = "http://database.ratemyscholar.ca/Courses";

    constructor(private http: HttpClient) {}

    /** GET professors */
    async getCourses() {
        const a = await this.http.get<any>(this.professorsURL).toPromise();
        return a;
    }
}