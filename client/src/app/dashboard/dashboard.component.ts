import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../app.component';
import { UserService } from '../user/user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(private app: AppComponent, private user: UserService) { }

  ngOnInit() {
    this.app.name = this.user.getStoredUser().name;
    this.app.admin = this.user.getStoredUser().admin;
  }

}
