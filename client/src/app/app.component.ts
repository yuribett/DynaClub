import { Component } from '@angular/core';
import { MenuComponent } from './menu/menu.component';
import { AuthService } from './auth/auth.service';
import { UserService } from './user/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  name: string;
  admin: boolean;
 
  constructor(private authService: AuthService, private user: UserService) {
    if(this.authService.isLoggedIn()){
        this.name = this.user.getStoredUser().name;
        this.admin = this.user.getStoredUser().admin;
    }
  }

}
