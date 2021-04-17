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
    const res = await this.http.get<any>(    // console.log('testing reviews');
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

  public async getAverageScore(target_type, target_id) {
    var data_comments = await this.getReviews(target_type, target_id);
    data_comments = data_comments.reviews;

    let temp:number = 0;
    for (let i = 0; i < data_comments.length; i++) {
      temp += data_comments[i].score;
    }
    var avg = temp / data_comments.length;
    avg = Math.round(avg * 10) / 10;
    return avg;
  }

}
