import { User } from '../../user/user';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-donate',
  templateUrl: './donate.component.html',
  styleUrls: ['./donate.component.css']
})
export class DonateComponent implements OnInit {

  teamUsers: Array<User>;
  userSelected: User;

  constructor() { }

  ngOnInit() {
  }

  onChange(userSelected: User) {
    this.userSelected = userSelected;
  }

}
