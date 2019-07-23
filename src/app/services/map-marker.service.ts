import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MapMarkerService {
  clickEvent = new EventEmitter<any>();
  doubleClickEvent = new EventEmitter<{
    lat: number,
    long: number,
    airportCode: string,
    airportName: string
  }>();

  airportModeEvent = new EventEmitter<any>();
  routeModeEvent = new EventEmitter<any>();

  flightMarkerLoadComplete = new EventEmitter<any>();

  searchByClickEvent = new EventEmitter<any>();
  removeSearchResultEvent = new EventEmitter<void>();

  constructor() { }

  onClickEvent(data: any) {
    this.clickEvent.emit(data);
  }

  onDoubleClickEvent(data: {
    lat: number,
    long: number,
    airportCode: string,
    airportName: string
  }) {
    this.doubleClickEvent.emit(data);
  }

  onAirportModeClickEvent(data: any) {
    this.airportModeEvent.emit(data);
  }

  onRouteModeClickEvent(data: any) {
    this.routeModeEvent.emit(data);
  }
}
