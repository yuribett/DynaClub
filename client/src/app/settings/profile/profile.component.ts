import { Component, OnInit } from '@angular/core';
import { UserService } from '../../user/user.service';
import { User } from '../../user/user';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  user: User = new User();
  service: UserService;

  constructor(service: UserService) {
    this.service = service;

    this.service
      .findById(service.getStoredUser()._id)
      .subscribe(profile => {
        this.user = profile;
      }, erro => console.log(erro));
  }

  ngOnInit() {
  }

  saveUser() {
    this.service.save(this.user);
  }

}
