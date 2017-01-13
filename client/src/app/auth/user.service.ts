import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { LoginComponent } from '../login/login.component';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class UserService {

  private url: string = 'http://localhost:3000/auth';

  private _loggedIn: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public loggedIn: Observable<boolean> = this._loggedIn.asObservable();

  constructor(private http: Http) { }

  autentica(login: LoginComponent) {
      return this.http
                 .post(this.url, JSON.stringify(login))
                 .map((res) => {                     
                    var token = res.headers.get('x-access-token');
                    if (token) {
                        this._loggedIn.next(true);
                        localStorage.setItem('token', token);
                    }
                 });
  }

  logout() {
    localStorage.removeItem('token');
  }

  isLoggedIn() {
    let token = localStorage.getItem('token');

    if(token){ //essa atribuição é feita para atualizar a variavel e o resto do sistema ser notificado
      this._loggedIn.next(true);
    } else {
      this._loggedIn.next(false);
    }

    return this._loggedIn.getValue();
  }

}