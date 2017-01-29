import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { AppService } from '../app.service';
import { User } from '../user/user';
import { UserService } from '../user/user.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  user: User;
  data: string[] = [];

  constructor(private auth: AuthService, private appService: AppService, private userService: UserService) {
    if(this.auth.isLoggedIn()){
      this.user = userService.getStoredUser();
    }
  }

  ngOnInit():any {
      let _self = this;
      this.appService.getUser().subscribe((loggedUser: User) => {
         _self.user = loggedUser;
     });

  }

  logout(e) {
    e.preventDefault();
    this.auth.logout();
  }

}
