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
}
