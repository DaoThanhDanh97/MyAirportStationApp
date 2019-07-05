import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapViewRouteFormComponent } from './map-view-route-form.component';

describe('MapViewRouteFormComponent', () => {
  let component: MapViewRouteFormComponent;
  let fixture: ComponentFixture<MapViewRouteFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapViewRouteFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapViewRouteFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
