import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapViewFlightAirsigmetInfoComponent } from './map-view-flight-airsigmet-info.component';

describe('MapViewFlightAirsigmetInfoComponent', () => {
  let component: MapViewFlightAirsigmetInfoComponent;
  let fixture: ComponentFixture<MapViewFlightAirsigmetInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapViewFlightAirsigmetInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapViewFlightAirsigmetInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
