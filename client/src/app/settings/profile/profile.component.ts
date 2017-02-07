import { Component, OnInit } from '@angular/core';
import { UserService } from '../../user/user.service';
import { User } from '../../user/user';
import { AppService } from '../../app.service';

@Component({
	selector: 'app-profile',
	templateUrl: './profile.component.html',
	styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

	user: User = new User();

	constructor(private userService: UserService, private appService: AppService) {
		this.userService = userService;

		this.userService
			.findById(userService.getStoredUser()._id)
			.subscribe(profile => {
				this.user = profile;
			}, erro => console.log(erro));
	}

	ngOnInit() {
	}

	saveUser() {
		this.userService.save(this.user).subscribe(updatedUser => this.appService.setUser(updatedUser));
	}

}
