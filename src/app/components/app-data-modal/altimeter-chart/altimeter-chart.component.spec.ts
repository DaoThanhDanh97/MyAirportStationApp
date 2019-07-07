import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AltimeterChartComponent } from './altimeter-chart.component';

describe('AltimeterChartComponent', () => {
  let component: AltimeterChartComponent;
  let fixture: ComponentFixture<AltimeterChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AltimeterChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AltimeterChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
