import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';

const tokenName = 'token';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private isLogged$ = new BehaviorSubject(false);
  // private url = `${environment.apiBaseUrl}/api/auth`;
  private url = `${environment.apiBaseUrl}/user`;

  // private user = { username: 'test', email: 'test@skywalker.com' };  //defined with all parameter that login function provides

  //Currently only return these two attributes
  private user = { uuid: 'test', token:"test" };



  constructor(private http: HttpClient) {

  }

  public get isLoggedIn(): boolean {
    return this.isLogged$.value;
  }


  //This function sends post request with username and password
  public login(data): Observable<any> {
    return this.http.post(`${this.url}/login`, data)
      .pipe(
        map((res: { uuid: any, token: string }) => {
          this.user = res;
          localStorage.setItem('uuid', res.uuid);
          localStorage.setItem(tokenName, res.token);
          // localStorage.setItem('username', res.username);
          // localStorage.setItem('email', res.email);
          this.isLogged$.next(true);
          return this.user;
        }));
  }

  public logout() {
    return this.http.get(`${this.url}/logout`)
      .pipe(map((data) => {
        localStorage.clear();
        this.user = null;
        this.isLogged$.next(false);
        return of(false);

      }));
  }


  //Changes pending. Need to
  public signup(data) {
    return this.http.post(`${this.url}/signup`, data)
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
    // it's fake and useing only for example
    if (localStorage.getItem('username') && localStorage.getItem('email')) {
      this.user = {
        // username: localStorage.getItem('username'),
        // email: localStorage.getItem('email'),
        uuid: localStorage.getItem('uuid'),
        token: localStorage.getItem(tokenName),
      };
    }
    return of(this.user);
  }
}
