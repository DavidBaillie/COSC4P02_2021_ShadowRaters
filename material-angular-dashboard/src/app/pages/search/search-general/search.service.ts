import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import {IProfessor} from './professor';

@Injectable()
export class SearchService {
    url:string = "http://database.ratemyscholar.ca/";
    reviewUrl:string;

    constructor(private http: HttpClient) {}

    /** GET professors | courses | departments */
    async getHits(type:string) {
        const a = await this.http.get<any>(this.url+type).toPromise();
        return a;
    }

      /** GET reviews by id */
  async getReviews(type:string, id:string) {
    this.reviewUrl = `http://database.ratemyscholar.ca/${type}/review/${id}`;
    const res = await this.http.get<any>(this.reviewUrl).toPromise();
    console.log("testing reviews")
    console.log(res)
    return res;
  }

  getRightId(hit:any, target_type:string) {
    console.log(target_type)
    switch(target_type) {
      case "professor":
        return hit.pid;
      case "university":
        return hit.uid;
      case "department":
        return hit.did;
      case "course":
        return hit.cid;
    }
  }

  getRightHits(hits:any, target_type:string) {
    switch(target_type) {
      case "professor":
        return hits.professor;
      case "university":
        return hits.university;
      case "department":
        return hits.department;
      case "course":
        return hits.course;
    }
  }

}
