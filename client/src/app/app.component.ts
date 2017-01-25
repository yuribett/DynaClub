import { Component } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { UserService } from './user/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  
    name: string = "";
    admin: boolean = false;

    constructor(private auth: AuthService, private userService: UserService){
      if(this.auth.isLoggedIn()){
        this.name = this.userService.getStoredUser().name;
        this.admin = this.userService.getStoredUser().admin;
      }
     }

    logout(e) {
      e.preventDefault();
      this.auth.logout();
    }

}
