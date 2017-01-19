import { Component } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { UserService } from './user/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  
    constructor(private auth: AuthService, private user: UserService){ }

    logout(e) {
      e.preventDefault();
      this.auth.logout();
    }

}
