import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import * as io from 'socket.io-client';

@Injectable()
export class TestService {

	private url = 'http://localhost:3000/ioTransaction';
	private socket;

	sendMessage(message) {
		this.socket = io(this.url);
		console.log(this.socket);

		this.socket.emit('add-message', message);
	}

	getMessages() {
		console.log('getMessages');
		let observable = new Observable(observer => {
			this.socket = io(this.url);
			console.log(this.socket);
			this.socket.on('message', (data) => {
				console.log('data >>>> ', data);
				observer.next(data);
			});
			return () => {
				console.log('disconnecting');
				this.socket.disconnect();
			};
		})
		return observable;
	}

}
