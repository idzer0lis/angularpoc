import { Injectable } from '@angular/core';
import { Http , Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { User } from '../user/user';
import { Router } from '@angular/router';

@Injectable()
export class UserService {
  private usersUrl = 'api/users';  // URL mockup web API
  constructor(
    private http: Http,
    private router: Router
  ) {}

  login(username: string, password: string): Observable<User> {
    return this.http.get(this.usersUrl)
      .map((response: Response) => {
        let users = response.json().data || {};
        let found = false;
        if (users.length) {
          // find if any user matches login credentials
          users.forEach(user => {
            if (user.username === username && user.password === password && user.token) {
              // store user details and token in local storage to keep user logged in between page refreshes
              localStorage.setItem('currentUser', JSON.stringify(user));
              found = true;
              return user;
            }
          });
          if (!found) { throw new Error('Invalid Username or Password'); }
        }
      }).catch(this.handleError);
  }

  logout(): void {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }
  private handleError (error: Response | any) {
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }
}
