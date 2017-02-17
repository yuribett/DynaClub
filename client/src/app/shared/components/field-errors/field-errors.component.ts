import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'field-errors',
  templateUrl: './field-errors.component.html',
  styleUrls: ['./field-errors.component.css']
})
export class FieldErrorsComponent implements OnInit {

  @Input() errors: string[];

  constructor() { }

  ngOnInit() {
  }

}
