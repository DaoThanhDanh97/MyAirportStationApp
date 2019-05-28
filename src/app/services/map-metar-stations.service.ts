import { Injectable, EventEmitter } from '@angular/core';
import * as mapMetarStations from '../JSON/metar_list.json'
import { StationDetail } from '../models/station_detail.model';

@Injectable({
  providedIn: 'root'
})
export class MapMetarStationsService {
  private stations: Array<StationDetail> = [];

  stationsEvent = new EventEmitter<Array<StationDetail>>();

  stationsByStateEvent = new EventEmitter<Array<{airportName: string, airportCode: string}>>();

  constructor() {
    this.getStationsData();
  }

  getStationsData() {
    mapMetarStations.default.map(item => {
      this.stations.push(new StationDetail(item.latitude, item.longitude,item.is_international, item.airportCode, item.major, item.stateName, item.stateAbbr, item.airportName));
    })

    this.stationsEvent.emit(this.stations.filter(item => item.isMajor == true).slice());
  }

  onBoundaryChange(boundary: any, zoomLevel: number) {
    console.log(zoomLevel);
    if(zoomLevel < 8) {
      this.stationsEvent.emit(this.stations.filter(item => item.isMajor == true));
    }
    else if (zoomLevel < 10) {
      this.stationsEvent.emit(this.stations.filter(item => item.isInternational == true));
    }
    else {
      this.stationsEvent.emit(this.stations.filter(item => (boundary.south < item.lat && boundary.north > item.lat && boundary.west < item.long && boundary.east > item.long)));
    }
  }

  onStateChange(state: string) {
    this.stationsByStateEvent.emit(this.stations.filter(item => item.stateAbbr == state).map(item => {
      return {
        airportName: item.airportName,
        airportCode: item.airportCode
      }
    }));
  }
}
