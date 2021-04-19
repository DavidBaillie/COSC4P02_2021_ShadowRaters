import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class SearchService {
  url = 'http://database.ratemyscholar.ca/';
  reviewUrl: string;

  constructor(private http: HttpClient) {}

    /** GET professors | courses | departments */
  async getHits(type: string) {
    const a = await this.http.get<any>(this.url + type,{ withCredentials: true }).toPromise();
    return a;
  }

      /** GET reviews by id */
  async getReviews(type: string, id: string) {
    this.reviewUrl = `http://database.ratemyscholar.ca/${type}/reviews/${id}`;
    const res = await this.http.get<any>(
      this.reviewUrl,{ withCredentials: true }).toPromise();
    return res;
  }


  //Return the correct id attribute
  getRightId(hit: any, target_type: string) {
    switch (target_type) {
      case 'professor':
        return hit.pid;
      case 'university':
        return hit.uid;
      case 'department':
        return hit.did;
      case 'course':
        return hit.cid;
    }
  }

  //Return an array of all prof/university/depart/course
  getRightHits(hits: any, target_type: string) {
    switch (target_type) {
      case 'professor':
        return hits.professor;
      case 'university':
        return hits.university;
      case 'department':
        return hits.department;
      case 'course':
        return hits.course;
    }
  }

}
