import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import {ProfessorDetail} from './professorReviews';

@Injectable()
export class SearchProfessorService {
  private professorsURL: string;
  private professorReviewURL: string;

  constructor(private http: HttpClient) {}

  /** GET professor reviews by pid */
  async getProfReviews(pid:string) {
    this.professorReviewURL = "http://database.ratemyscholar.ca/professor/reviews/"+pid;
    const res = await this.http.get<any>(this.professorReviewURL).toPromise();
    console.log("testing reviews")
    console.log(res)
    return res;
  }

  /** GET professors */
  async getProfessors() {
    this.professorsURL = "http://database.ratemyscholar.ca/professor";
    const res = await this.http.get<any>(this.professorsURL).toPromise();
    console.log("test getting all professors")
    console.log(res)
    return res;
  }



}
