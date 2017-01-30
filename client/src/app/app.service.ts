import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { User } from './user/user';

@Injectable()
export class AppService {

  private user: User;
  private subject: Subject<User> = new Subject<User>();

  setUser(user: User): void {
    this.user = user;
    this.subject.next(user);
  }
  
  getUser(): Observable<User> {
    return this.subject.asObservable();
  }

}
