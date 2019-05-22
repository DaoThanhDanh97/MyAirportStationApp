import { Injectable, EventEmitter } from '@angular/core';
import * as mapMetarStations from '../JSON/metar_list.json'

@Injectable({
  providedIn: 'root'
})
export class MapMetarStationsService {
  private stations: Array<{lat: number, long: number}> = [];

  stationsEvent = new EventEmitter<Array<{lat: number, long: number}>>();

  constructor() {
    this.getStationsData();
  }

  getStationsData() {
    mapMetarStations.default.map(item => {
      this.stations.push({
        lat: item.latitude,
        long: item.longitude
      })
    })

    this.stationsEvent.emit(this.stations.slice());
  }
}
