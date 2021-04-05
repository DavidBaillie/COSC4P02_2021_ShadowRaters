import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import {map, retry} from 'rxjs/operators';

import { environment } from '../../../environments/environment';

const tokenName = 'token';

@Injectable({
  providedIn: 'root',
})
export class AuthService{

  private isLogged$ = new BehaviorSubject(false);
  // private url = `${environment.apiBaseUrl}/api/auth`;
  private url = `${environment.apiBaseUrl}/user`;
  //Initialize all attributes a user has
  private user = { username:"", email:"", uuid: "", token:"" };

  // httpOptions = {
  //   headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  //   withCredentials: true,
  //   observe: 'response' as 'response'
  // };

  constructor(private http: HttpClient) {

  }

  public get isLoggedIn(): boolean {
    return this.isLogged$.value;
  }

  // private setCookie(name: string, val: string) {
  //   const date = new Date();
  //   const value = val;
  //
  //   // Set it expire in 7 days
  //   date.setTime(date.getTime() + (7 * 24 * 60 * 60 * 1000));
  //
  //   // Set it
  //   document.cookie = name+"="+value+"; expires="+date.toUTCString()+"; path=/";
  // }
  //
  // private getCookie(name: string) {
  //   const value = "; " + document.cookie;
  //   const parts = value.split("; " + name + "=");
  //
  //   if (parts.length == 2) {
  //     return parts.pop().split(";").shift();
  //   }
  // }
  //
  // private deleteCookie(name: string) {
  //   const date = new Date();
  //   // Set it expire in -1 days
  //   date.setTime(date.getTime() + (-1 * 24 * 60 * 60 * 1000));
  //   document.cookie = name+"=; expires="+date.toUTCString()+"; path=/";
  // }

  //This function sends post request with username and password
  public login(data): Observable<any> {
    return this.http.post(`${this.url}/login`, data,{withCredentials: true})
      .pipe(
        map((res:{msg:"" ,username:"", email:"", uuid: "", token: ""}) => {
            this.user = res;
            localStorage.setItem('username', res.username);
            localStorage.setItem('email', res.email);
            localStorage.setItem('uuid', res.uuid);
            localStorage.setItem(tokenName, res.token);
            this.isLogged$.next(true);
            return this.user;
        }
        ));
  }


  //Post the comment and return a message
  public postComment(type:string,id:string,myComment){
    return this.http.post(`http://database.ratemyscholar.ca/${type}/reviews/${id}`, myComment,{withCredentials: true})
      .pipe(
        map((res: { msg:string }) => {
          console.log(res.msg);
          return res;
        }));
  }



  public logout() {
    return this.http.get(`${this.url}/logout`,{ withCredentials: true })
      .pipe(map((data) => {
        localStorage.clear();
        this.user = null;
        this.isLogged$.next(false);
        return of(false);

      }));
  }


  //Changes pending. Need to
  public signup(data) {
    return this.http.post(`${this.url}/signup`, data,{ withCredentials: true })
      .pipe(
        map((res: { username: string, email: string }) => {
          localStorage.setItem('username', res.username);
          localStorage.setItem('email', res.email);
          this.isLogged$.next(true);
          return this.user;
        }));
  }

  public get authToken(): string {
    return localStorage.getItem(tokenName);
  }

  public get userData(): Observable<any> {
    // send current user or load data from backend using token
    return this.loadUser();
  }

  private loadUser(): Observable<any> {
    // use request to load user data with token
    // it's fake and using only for example
    if (localStorage.getItem('username') && localStorage.getItem('email')) {
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
