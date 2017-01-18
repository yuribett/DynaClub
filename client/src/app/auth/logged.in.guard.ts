import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class LoggedInGuard implements CanActivate {

  constructor(private auth: AuthService, private router: Router) {}

  canActivate() {
      let isLoggedIn = this.auth.isLoggedIn();
      if(!isLoggedIn){
          this.router.navigate(['/login']);
      }
      return isLoggedIn;
  }
}