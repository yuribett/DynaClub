import { Component, OnInit, OnDestroy } from '@angular/core';
import { TestService } from './test.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css'],
  providers: [TestService]
})
export class TestComponent implements OnInit, OnDestroy {

  messages = [];
  connection;
  message;

  constructor(private service: TestService) {}

  sendMessage(){
    this.service.sendMessage(this.message);
    this.message = '';
  }

  ngOnInit() {
    this.connection = this.service.getMessages().subscribe(message => {
      this.messages.push(message);
    })
  }
  
  ngOnDestroy() {
    this.connection.unsubscribe();
  }

}
