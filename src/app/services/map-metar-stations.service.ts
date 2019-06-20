import { Injectable, EventEmitter } from '@angular/core';
import * as mapMetarStations from '../JSON/metar_list.json'
import { StationDetail } from '../models/station_detail.model';

@Injectable({
  providedIn: 'root'
})
export class MapMetarStationsService {
  private stations: Array<StationDetail> = [];

  clickTrigger = false;

  stationsEvent = new EventEmitter<Array<StationDetail>>();

  isModifiedByClickAction: boolean = false;

  stationsByStateEvent = new EventEmitter<Array<{airportName: string, airportCode: string}>>();

  mapMoveByClickEvent = new EventEmitter<string>();

  stationChangeEvent = new EventEmitter<string>();

  stationsByInputEvent = new EventEmitter<{result: Array<{airportName: string, airportCode: string}>, inputSource: string}>();

  getStationToMoveEvent = new EventEmitter<StationDetail>();

  constructor() {
  }

  getStationsData() {
    mapMetarStations.default.map(item => {
      this.stations.push(new StationDetail(item.latitude, item.longitude,item.is_international, item.airportCode, item.major, item.stateName, item.stateAbbr, item.airportName));
    })

    this.stationsEvent.emit(this.stations.filter(item => item.isMajor == true).slice());
  }

  onBoundaryChange(boundary: any, zoomLevel: number) {
    console.log(zoomLevel);
    console.log(this.clickTrigger);
    if(this.clickTrigger == false) {
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
  }

  setClickTrigger(value: boolean) {
    this.clickTrigger = value;
  }

  onStateChange(state: string) {
    console.log(this.clickTrigger);

    this.stationsEvent.emit(
      (this.clickTrigger == true)? this.stations.filter(item => item.stateAbbr == state) : this.stations.filter(item => item.isMajor == true)
    );

    //move map
    this.mapMoveByClickEvent.emit(state);
  }

  onStationChange(station: string) {
    this.stationChangeEvent.emit(station);
  }

  onInputChange(station: string, src: string) {
    let lowerCase = station.toLowerCase();

    if(lowerCase.length > 3) {
      this.stationsByInputEvent.emit({
        result: this.stations.filter(item => item.airportCode.toLowerCase().indexOf(lowerCase) == 0 || item.airportName.toLowerCase().indexOf(lowerCase) == 0).map(item => {
          return {
            airportName: item.airportName,
            airportCode: item.airportCode        
          }
        }),
        inputSource: src
      })
    }

    else {
      this.stationsByInputEvent.emit({
        result: [],
        inputSource: src
      });
    }
  }

  getMoveDestination(station: string) {
    this.getStationToMoveEvent.emit(this.stations.find(item => item.airportCode == station));
  }

  getStateToChange(state: string) {
    this.stationsEvent.emit(this.stations.filter(item => item.stateAbbr == state));
  }

  getBoundingAreaClickEvent(lat: number, long: number, radius: number) {
    this.clickTrigger = true;

    this.stationsEvent.emit(
      this.stations.filter((item: StationDetail) => {
        let distance = google.maps.geometry.spherical.computeDistanceBetween(
          new google.maps.LatLng(item.lat, item.long),
          new google.maps.LatLng(lat, long)
        )

        return distance < radius;
      })
    )
  }
}
