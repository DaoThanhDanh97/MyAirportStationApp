import { Injectable, EventEmitter } from '@angular/core';
import * as mapMetarStations from '../JSON/metar_list.json'
import { StationDetail } from '../models/station_detail.model';
import { NgxXml2jsonService } from 'ngx-xml2json';

@Injectable({
  providedIn: 'root'
})
export class MapMetarStationsService {
  private stations: Array<StationDetail> = [];

  clickTrigger = false;

  stationsEvent = new EventEmitter<Array<StationDetail>>();

  isModifiedByClickAction: boolean = false;

  stationsByStateEvent = new EventEmitter<Array<{ airportName: string, airportCode: string }>>();

  mapMoveByClickEvent = new EventEmitter<string>();

  stationChangeEvent = new EventEmitter<string>();

  stationsByInputEvent = new EventEmitter<{ result: Array<{ airportName: string, airportCode: string }>, inputSource: string }>();

  getStationToMoveEvent = new EventEmitter<StationDetail>();

  flightStationsEvent = new EventEmitter<{ departure: StationDetail, arrival: StationDetail, stationsList: Array<StationDetail> }>();

  constructor(private xmlJson: NgxXml2jsonService) {
  }

  getStationsData() {
    mapMetarStations.default.map(item => {
      this.stations.push(new StationDetail(item.latitude, item.longitude, item.is_international, item.airportCode, item.major, item.stateName, item.stateAbbr, item.airportName));
    })

    this.stationsEvent.emit(this.stations.filter(item => item.isMajor == true).slice());
  }

  onBoundaryChange(boundary: any, zoomLevel: number) {
    if (this.clickTrigger == false) {
      if (zoomLevel < 8) {
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
    this.stationsEvent.emit(
      (this.clickTrigger == true) ? this.stations.filter(item => item.stateAbbr == state) : this.stations.filter(item => item.isMajor == true)
    );

    //move map
    this.mapMoveByClickEvent.emit(state);
  }

  onStationChange(station: string) {
    this.stationChangeEvent.emit(station);
  }

  onInputChange(station: string, src: string) {
    let lowerCase = station.toLowerCase();

    if (lowerCase.length > 3) {
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

  onRouteFindAction(departure: string, arrival: string) {
    let startLoc = this.stations.find(item => item.airportCode == departure);
    let endLoc = this.stations.find(item => item.airportCode == arrival);

    fetch('https://aviationweather.gov/adds/dataserver_current/httpparam?dataSource=stations&requestType=retrieve&format=xml&flightPath=20;' + startLoc.long + "," + startLoc.lat + ";" + endLoc.long + "," + endLoc.lat)
      .then(res => res.text())
      .then(data => {
        let parser = new DOMParser();
        let xml = parser.parseFromString(data, 'text/xml');
        let retrievedJson = <any>{};
        retrievedJson = this.xmlJson.xmlToJson(xml);
        let resultStations = retrievedJson.response.data.Station.map(item => item.station_id);
        let returnedStations = <any>{};
        returnedStations = this.stations.filter(item => resultStations.indexOf(item.airportCode) > -1)
          .filter(item => item.airportCode != departure && item.airportCode != arrival);

        let departureStation = this.stations.find(item => item.airportCode == departure);
        let arrivalStation = this.stations.find(item => item.airportCode == arrival);

        this.flightStationsEvent.emit({
          departure: departureStation,
          arrival: arrivalStation,
          stationsList: returnedStations
        })
      })
  }

  getSingleStationData(station: string) {
    return this.stations.find(item => item.airportCode == station);
  }
}
