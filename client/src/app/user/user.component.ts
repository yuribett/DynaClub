import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  _id: string;
  name: string;
  user: string;
  email: string;
  password: string;
  admin: boolean;
  teams: string;
  active: boolean;

  constructor() { }

  ngOnInit() {
  }

}
