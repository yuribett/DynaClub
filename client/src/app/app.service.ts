import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { User } from './user/user';
import { Team } from './teams/team';

@Injectable()
export class AppService {

  private user: User;
  private subjectUser: Subject<User> = new Subject<User>();
  private currentTeam: Team;
  private subjectCurrentTeam: Subject<Team> = new Subject<Team>();

  setUser(user: User): void {
    this.user = user;
    this.subjectUser.next(user);
  }
  
  getUser(): Observable<User> {
    return this.subjectUser.asObservable();
  }

  setCurrentTeam(currentTeam: Team): void {
    this.currentTeam = currentTeam;
    this.subjectCurrentTeam.next(currentTeam);
  }
  
  getCurrentTeam(): Observable<Team> {
    return this.subjectCurrentTeam.asObservable();
  }

}
