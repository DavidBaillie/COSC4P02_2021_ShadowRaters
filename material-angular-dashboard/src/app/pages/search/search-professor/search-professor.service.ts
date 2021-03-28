import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import {IProfessor} from './professor';

@Injectable()
export class SearchProfessorService {
    professorsURL = "http://database.ratemyscholar.ca/professor";

    constructor(private http: HttpClient) {}

    /** GET professors */
    async getProfessors() {
        const a = await this.http.get<any>(this.professorsURL).toPromise();
        console.log("hello?")
        console.log(a)
        return a;
    }
}
