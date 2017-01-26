import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  @Input() name: string;
  @Input() admin: boolean;

  constructor(private auth: AuthService) {}

  ngOnInit() { }

  logout(e) {
    e.preventDefault();
    this.auth.logout();
  }

}
