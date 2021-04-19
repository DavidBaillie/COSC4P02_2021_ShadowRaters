import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {map} from 'rxjs/operators';

import {environment} from '../../../environments/environment';

const tokenName = 'token';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  //Environment url link
  private url = `${environment.apiBaseUrl}/user`;

  //Initialize all attributes after user login
  private user = {username: "", email: "", uuid: "", token: ""};
  private user_reg = {admin: false, username: "", password: "", email: "", school: null, program: null}

  constructor(private http: HttpClient) {

  }

  //This function sends post request with username and password
  public login(data): Observable<any> {
    return this.http.post(`${this.url}/login`, data, {withCredentials: true})
      .pipe(
        map((res: { msg: "", username: "", email: "", uuid: "", token: "" }) => {
            this.user = res;
            if ((res.uuid != undefined) && (res.token != undefined)) {
              localStorage.setItem('username', res.username);
              localStorage.setItem('email', res.email);
              localStorage.setItem('uuid', res.uuid);
              localStorage.setItem(tokenName, res.token);
            } else {
            }
            return this.user;
          }
        ));
  }


  //Post the comment and return a message
  public postComment(type: string, id: string, myComment) {
    let url = `${environment.apiBaseUrl}/${type}/reviews/${id}`;
    return this.http.post(url, myComment, {withCredentials: true})
      .pipe(
        map((res: { msg: string }) => {
          return res;
        }));
  }

  public thumbUp(type:string,id:string){
    let token = {
      token: localStorage.getItem('token')
    }
    let url = `${environment.apiBaseUrl}/${type}/reviews/vote_agree/${id}`;
    // console.log(url);
    return this.http.post(url,token)
      .pipe(
        map((res: { msg: string }) => {
          return res;
        }));

  }

  // async getReviews(type: string, id: string) {
  //   this.reviewUrl = `http://database.ratemyscholar.ca/${type}/reviews/${id}`;
  //   const res = await this.http.get<any>(
  //     this.reviewUrl,{ withCredentials: true }).toPromise();
  //   return res;
  // }


  public thumbDown(type:string,id:string){
    let token = {
      token: localStorage.getItem('token')
    }
    let url = `${environment.apiBaseUrl}/${type}/reviews/vote_disagree/${id}`;
    return this.http.post(url,token)
      .pipe(
        map((res: { msg: string }) => {
          return res;
        }));
  }

  //Cancel a thumb up/down of a comment from a user
  async cancelThumb(type:string,id:string){
    let token = {
      token: localStorage.getItem('token')
    }
    let url = `${environment.apiBaseUrl}/${type}/reviews/vote_cancel/${id}`;
    return this.http.post(url, token)
      .pipe(
        map((res: { msg: string }) => {
          console.log(res.msg);
          return res;
        })).toPromise();
  }

  //Get voting information of the current user, which should be reflected on the thumb up/down icon.
  public getVotes(type:string){
    let token = {
      token: localStorage.getItem('token')
    }
    let url = `${environment.apiBaseUrl}/${type}/getVotes`;
    return this.http.post(url,token)
      .pipe(
        map((res: { msg: string,votes:any }) => {
          return res.votes;
        }));
  }

  public logout() {
    localStorage.clear();
  }

  //Try to register a new account
  public register(data) {
    this.user_reg = {
      admin: false,
      username: data.username,
      password: data.password,
      email: data.email,
      school: null,
      program: null
    };
    console.log(data.username);
    return this.http.post(`${this.url}/createAccount`, this.user_reg)
      .pipe(
        map((res: { msg: string }) => {
          return res;
        }));
  }

  public get authToken(): string {
    return localStorage.getItem(tokenName);
  }

  public get userData(): Observable<any> {
    return this.loadUser();
  }

  private loadUser(): Observable<any> {
    if (localStorage.getItem('username') && localStorage.getItem('uuid')) {
      this.user = {
        username: localStorage.getItem('username'),
        email: localStorage.getItem('email'),
        uuid: localStorage.getItem('uuid'),
        token: localStorage.getItem(tokenName),
      };
    }
    return of(this.user);
  }
}
