import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyticsOnDateComponent } from './analytics-on-date.component';

describe('AnalyticsOnDateComponent', () => {
  let component: AnalyticsOnDateComponent;
  let fixture: ComponentFixture<AnalyticsOnDateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnalyticsOnDateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalyticsOnDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
