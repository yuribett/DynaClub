import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { AuthLogin } from '../login/login.component';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Router } from '@angular/router';

@Injectable()
export class UserService {

  private url: string = 'http://localhost:3000/auth';

  private _loggedIn: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public loggedIn: Observable<boolean> = this._loggedIn.asObservable();

  constructor(private http: Http, private route: Router) { }

  autentica(login: AuthLogin) { //: Observable<boolean>

      var headers = new Headers();
      headers.append('Content-Type', 'application/json');
      headers.append('Authorization', 'Basic ' + btoa(login.user + ":" + login.password));

      return this.http
                 .post(this.url, JSON.stringify(login)) //, {headers : headers}
                 .map((res) => {  
                          
                    let token = res.headers.get('x-access-token');
                    console.log('>>>>',res.headers); //OBJECT HEADERS COM MAP VAZIO
                    
                    if (token) {
                        this._loggedIn.next(true);
                        localStorage.setItem('token', token);
                    }
                 });
  }

  logout() {
    localStorage.removeItem('token');
    this.route.navigate(['/login']);
  }

  isLoggedIn() {
    let token = localStorage.getItem('token');

    if(token){ //essa atribui��o � feita para atualizar a variavel e o resto do sistema ser notificado
      this._loggedIn.next(true);
    } else {
      this._loggedIn.next(false);
    }

    return this._loggedIn.getValue();
  }

}