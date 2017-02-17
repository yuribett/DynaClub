import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { AuthLogin } from '../login/login.component';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Router } from '@angular/router';
import { UserService } from '../shared/services/user.service';
import { Globals } from '../app.globals';
import { AppService } from '../app.service';
import { User } from '../shared/models/user';

@Injectable()
export class AuthService {

  private _loggedIn: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public loggedIn: Observable<boolean> = this._loggedIn.asObservable();

  constructor(private http: Http, private route: Router, private user: UserService, private appService: AppService) { }

  auth(login: AuthLogin) { //: Observable<User> {
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');

    return this.http
      .post(`${Globals.API_URL}/auth`, JSON.stringify(login), { headers: headers }) //
      .map((res) => {
        let token = res.headers.get('x-access-token');
        if (token) {
          this._loggedIn.next(true);
          this.appService.setLocalStorage(login.stayConnected);
          this.appService.getStorage().setItem(Globals.LOCAL_TOKEN, token);
          this.appService.getStorage().setItem(Globals.CURRENT_TEAM, JSON.stringify(res.json().teams[0]));
          this.user.storeUser(res.json());
        }
      },
      (err) => console.log(err)
      )
      .catch(error => Observable.throw(error._body));
  }

  logout() {
    this.appService.getStorage().removeItem(Globals.LOCAL_TOKEN);
    this.appService.getStorage().removeItem(Globals.CURRENT_TEAM);
    this.user.removeStoredUser();
    this._loggedIn.next(false);
    this.route.navigate(['/login']);
  }

  isLoggedIn() {
    let token = this.appService.getStorage().getItem(Globals.LOCAL_TOKEN);

    if (token) {
      this._loggedIn.next(true);
    } else {
      this._loggedIn.next(false);
    }

    return this._loggedIn.getValue();
  }

}