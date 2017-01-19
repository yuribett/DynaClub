import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { AuthLogin } from '../login/login.component';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Router } from '@angular/router';
import { UserService } from '../user/user.service';
import { Globals } from '../app.globals';

@Injectable()
export class AuthService {

  private _loggedIn: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public loggedIn: Observable<boolean> = this._loggedIn.asObservable();

  constructor(private http: Http, private route: Router, private user: UserService) { }

  autentica(login: AuthLogin) { //: Observable<boolean>

      var headers = new Headers();
      headers.append('Content-Type', 'application/json');
      
      return this.http
                 .post(`${Globals.API_URL}/auth`, JSON.stringify(login), {headers : headers}) //
                 .map((res) => {  
                          
                    let token = res.headers.get('x-access-token');
                    
                    if (token) {
                        this._loggedIn.next(true);
                        localStorage.setItem(Globals.LOCAL_TOKEN, token);
                        this.user.storeUser(res.json())
                    }
                 });
  }

  logout() {
    localStorage.removeItem(Globals.LOCAL_TOKEN);
    this.user.removeStoredUser();
    this._loggedIn.next(false);
    this.route.navigate(['/login']);
  }

  isLoggedIn() {
    let token = localStorage.getItem(Globals.LOCAL_TOKEN);

    if(token){
      this._loggedIn.next(true);
    } else {
      this._loggedIn.next(false);
    }

    return this._loggedIn.getValue();
  }

}