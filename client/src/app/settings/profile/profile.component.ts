import { Component, OnInit } from '@angular/core';
import { UserService } from '../../user/user.service';
import { UserComponent } from '../../user/user.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  user: UserComponent = new UserComponent();
  service: UserService;

  constructor(service: UserService) {
    this.service = service;

    let storedUser = JSON.parse(localStorage.getItem('dynaclub-user'));

    this.service
      .findById(storedUser._id)
      .subscribe(profile => {
        this.user = profile;
      }, erro => console.log(erro));
  }

  ngOnInit() {
  }

}
