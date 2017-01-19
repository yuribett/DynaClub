import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  _id: String;
  name: String;
  user: String;
  email: String;
  password: String;
  admin: Boolean;
  teams: String;
  active: Boolean;

  constructor() { }

  ngOnInit() {
  }

}
