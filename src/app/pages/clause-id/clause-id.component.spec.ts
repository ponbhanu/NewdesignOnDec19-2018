import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClauseIdComponent } from './clause-id.component';

describe('ClauseIdComponent', () => {
  let component: ClauseIdComponent;
  let fixture: ComponentFixture<ClauseIdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClauseIdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClauseIdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
