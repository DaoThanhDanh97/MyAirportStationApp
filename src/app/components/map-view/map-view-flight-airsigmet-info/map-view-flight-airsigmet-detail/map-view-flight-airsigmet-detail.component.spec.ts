import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapViewFlightAirsigmetDetailComponent } from './map-view-flight-airsigmet-detail.component';

describe('MapViewFlightAirsigmetDetailComponent', () => {
  let component: MapViewFlightAirsigmetDetailComponent;
  let fixture: ComponentFixture<MapViewFlightAirsigmetDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapViewFlightAirsigmetDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapViewFlightAirsigmetDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
