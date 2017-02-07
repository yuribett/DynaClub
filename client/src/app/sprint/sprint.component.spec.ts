/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SprintComponent } from './sprint.component';

describe('SprintComponent', () => {
  let component: SprintComponent;
  let fixture: ComponentFixture<SprintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SprintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SprintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
