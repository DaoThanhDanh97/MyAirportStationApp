import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapOptionMenuComponent } from './map-option-menu.component';

describe('MapOptionMenuComponent', () => {
  let component: MapOptionMenuComponent;
  let fixture: ComponentFixture<MapOptionMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapOptionMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapOptionMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
