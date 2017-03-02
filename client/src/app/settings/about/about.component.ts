import { Component, OnInit } from '@angular/core';

const { version: appVersion } = require('../../../../package.json')

@Component({
	selector: 'app-about',
	templateUrl: './about.component.html',
	styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

	private appVersion: string;

	constructor() {
		this.appVersion = appVersion;
	}

	ngOnInit() {
	}

}
