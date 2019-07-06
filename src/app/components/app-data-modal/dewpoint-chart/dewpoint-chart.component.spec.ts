import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DewpointChartComponent } from './dewpoint-chart.component';

describe('DewpointChartComponent', () => {
  let component: DewpointChartComponent;
  let fixture: ComponentFixture<DewpointChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DewpointChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DewpointChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
