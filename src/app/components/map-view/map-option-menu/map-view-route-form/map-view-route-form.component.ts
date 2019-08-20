import { Component, OnInit, ViewChild, ViewChildren, QueryList, AfterViewInit } from '@angular/core';
import { MapMetarStationsService } from 'src/app/services/map-metar-stations.service';
import { MapViewRouteFormInputComponent } from './map-view-route-form-input/map-view-route-form-input.component';
import { MapOptionSelectService } from 'src/app/services/map-option-select.service';
import { MapMarkerService } from 'src/app/services/map-marker.service';
import { SearchLineDirective } from 'src/app/directives/search-line.directive';
import { MapFlightRouteAdditionalService } from 'src/app/services/map-flight-route-additional.service';
import { NgxXml2jsonService } from 'ngx-xml2json';

@Component({
  selector: 'app-map-view-route-form',
  templateUrl: './map-view-route-form.component.html',
  styleUrls: ['./map-view-route-form.component.css']
})
export class MapViewRouteFormComponent implements OnInit, AfterViewInit {
  inputDepartureValue: string;
  inputDepartureDisplay: string;
  resultDepartureDisplay: string;
  departureValue: string;

  inputArrivalValue: string;
  inputArrivalDisplay: string;
  resultArrivalDisplay: string;
  arrivalValue: string;

  resultListDisplay: string;
  result: Array<{ airportName: string, airportCode: string }> = [];

  currentSearchLocation: string;

  finalArrival: string;
  finalDeparture: string;

  isSearchResultVisible: string = 'hidden';

  initialBoundary: any;

  resetBoundaryButtonDispMode: string;

  isRouteButtonClicked: boolean = false;

  @ViewChildren(SearchLineDirective) searchLines: QueryList<SearchLineDirective>;

  constructor(private mapMetarStationsEvent: MapMetarStationsService,
    private mapOptionSelectService: MapOptionSelectService,
    private mapMarkerService: MapMarkerService,
    private mapFlightRouteAdditionalService: MapFlightRouteAdditionalService,
    private xmlJson: NgxXml2jsonService
  ) {
    this.inputDepartureValue = '';
    this.inputDepartureDisplay = 'flex';
    this.resultDepartureDisplay = 'none';
    this.departureValue = '';

    this.inputArrivalValue = '';
    this.inputArrivalDisplay = 'flex';
    this.resultArrivalDisplay = 'none';
    this.arrivalValue = '';

    this.resultListDisplay = 'none';

    this.currentSearchLocation = '';

    this.finalArrival = '';
    this.finalDeparture = '';

    this.resetBoundaryButtonDispMode = 'none';
  }

  ngOnInit() {
    this.mapMetarStationsEvent.stationsByInputEvent.subscribe((value: any) => {
      this.onResultChange(value.result);
      this.currentSearchLocation = value.inputSource;
    })

    this.mapMarkerService.doubleClickEvent.subscribe((value: any) => {
      console.log('Received');
      if (this.currentSearchLocation == '') {
        this.onMarkerClick(value);
      } else {
        this.onItemClick(value);
      }
      this.currentSearchLocation = '';
    })
  }

  ngAfterViewInit() {
    this.mapFlightRouteAdditionalService.onMapBoundaryUpdate.subscribe((data: any) => {
      console.log(data);
      console.log(this.initialBoundary);
      if (data.north != this.initialBoundary.north || data.south != this.initialBoundary.south
        || data.west != this.initialBoundary.west || data.east != this.initialBoundary.east) {
        if (this.finalArrival != "" && this.finalDeparture != "") {
          this.resetBoundaryButtonDispMode = 'flex';
        }
      }
    })

    this.mapFlightRouteAdditionalService.onFlightDataLoadComplete.subscribe((data: any) => {
      console.log(data);
      this.initialBoundary = data;
      this.mapFlightRouteAdditionalService.onInitialRouteBoundaryReceived.emit();
    })
  }

  onResultChange(data: any) {
    this.result = data;
    this.resultListDisplay = (this.result.length > 0) ? 'flex' : 'none';
  }

  onItemClick(item: any) {
    this.resultListDisplay = 'none';
    if (this.currentSearchLocation == 'flightSearchDeparture') {
      this.finalDeparture = item.airportCode;
      this.inputDepartureDisplay = 'none';
      this.resultDepartureDisplay = 'flex';
      this.inputDepartureValue = '';
      this.departureValue = item.airportName + " (" + item.airportCode + ")";
    }
    else if (this.currentSearchLocation == 'flightSearchArrival') {
      this.finalArrival = item.airportCode;
      this.inputArrivalDisplay = 'none';
      this.resultArrivalDisplay = 'flex';
      this.inputArrivalValue = '';
      this.arrivalValue = item.airportName + " (" + item.airportCode + ")";
    }

    this.mapMetarStationsEvent.getMoveDestination(item.airportCode);
    this.onFlightButtonVisibleCheck();
    this.mapMetarStationsEvent.onFlightLocationSelection(item.airportCode, this.currentSearchLocation);
  }

  onResultDivClick(value: string) {
    if (value == 'departure') {
      this.finalDeparture = '';
      this.inputDepartureDisplay = 'flex';
      this.resultDepartureDisplay = 'none';
      this.inputDepartureValue = '';
      this.departureValue = '';
      setTimeout(() => this.searchLines.first.clickFocus(), 0);
    }
    else {
      this.finalArrival = '';
      this.inputArrivalDisplay = 'flex';
      this.resultArrivalDisplay = 'none';
      this.inputArrivalValue = '';
      this.arrivalValue = '';
      setTimeout(() => this.searchLines.last.clickFocus(), 0);
    }
    this.onFlightButtonVisibleCheck();
    this.resetBoundaryButtonDispMode = 'none';
    this.isRouteButtonClicked = false;
    this.mapFlightRouteAdditionalService.returnToDefaultMode.emit(value);
    this.mapFlightRouteAdditionalService.returnClickAction.emit(value);
  }

  onChangeMode(value: string) {
    this.mapOptionSelectService.onMapOptionSelectedEvent(value);
  }

  onMarkerClick(item: any) {
    if (this.finalDeparture == '') {
      this.finalDeparture = item.airportCode;
      this.inputDepartureDisplay = 'none';
      this.resultDepartureDisplay = 'flex';
      this.inputDepartureValue = '';
      this.departureValue = item.airportName + " (" + item.airportCode + ")";
    }
    else if (this.finalArrival == '') {
      this.finalArrival = item.airportCode;
      this.inputArrivalDisplay = 'none';
      this.resultArrivalDisplay = 'flex';
      this.inputArrivalValue = '';
      this.arrivalValue = item.airportName + " (" + item.airportCode + ")";
    }

    this.mapMetarStationsEvent.getMoveDestination(item.airportCode);
    this.onFlightButtonVisibleCheck();
  }

  onFlightButtonVisibleCheck() {
    this.isSearchResultVisible = (this.finalArrival != '' && this.finalDeparture != '') ? 'visible' : 'hidden';
  }

  onRouteFindAction() {
    if (this.isRouteButtonClicked == false) {
      this.airSigmetDataSearch();
      this.isRouteButtonClicked = true;
      this.mapMetarStationsEvent.onRouteFindAction(this.finalDeparture, this.finalArrival);
    }
  }

  onResetMapViewClick() {
    this.mapFlightRouteAdditionalService.resetBoundaryDataEvent.emit();
  }

  async airSigmetDataSearch() {
    let startPoint = this.mapMetarStationsEvent.getSingleStationData(this.finalDeparture);
    let endPoint = this.mapMetarStationsEvent.getSingleStationData(this.finalArrival);
    let callTime = await fetch('https://flighttime-calculator.com/calculate?lat1=' + startPoint.lat + '&lng1=' + startPoint.long + '&lat2=' + endPoint.lat + '&lng2=' + endPoint.long);
    let callRes = await callTime.json();
    if (callRes.flight_time != null) {
      let currentTime = new Date();
      let addedHours = parseInt(callRes.flight_time.split(" ")[0].replace(/\D/g, ""));
      let addedMinutes = parseInt(callRes.flight_time.split(" ")[1].replace(/\D/g, ""));
      let arriveTime = new Date(currentTime.getUTCFullYear(), currentTime.getMonth(), currentTime.getDate(),
        currentTime.getHours() + addedHours, currentTime.getMinutes() + addedMinutes);
      let currentTimeISO = currentTime.toISOString();
      let arriveTimeISO = arriveTime.toISOString();
      let airSigmetCall = await fetch('https://bcaws.aviationweather.gov/adds/dataserver_current/httpparam?dataSource=airsigmets&requestType=retrieve&format=xml&startTime=' + currentTimeISO + '&endTime=' + arriveTimeISO);
      let airSigmetRes = await airSigmetCall.text();
      let parser = new DOMParser();
      let xml = parser.parseFromString(airSigmetRes, 'text/xml');
      let jsonResponse = <any>{};
      jsonResponse = this.xmlJson.xmlToJson(xml);
      let airSigmetDatas = jsonResponse.response.data.AIRSIGMET;
      let maxLat = Math.max(...[startPoint.lat, endPoint.lat]);
      let minLat = Math.min(...[startPoint.lat, endPoint.lat]);
      let maxLong = Math.max(...[startPoint.long, endPoint.long]);
      let minLong = Math.min(...[startPoint.long, endPoint.long]);
      //console.log(airSigmetDatas);
      if (Array.isArray(airSigmetDatas)) {
        let filteredResult = airSigmetDatas.filter((item) => {
          return (this.checkPointArrayExistInArea(item.area.point, maxLat, minLat, maxLong, minLong) == true)
        })
        console.log(filteredResult);
        filteredResult = filteredResult.map(item => {
          return {
            type: this.setColorBasedOnAirSigmetType(item.airsigmet_type),
            pointArray: item.area.point.map(subItem => {
              return {
                lat: parseFloat(subItem.latitude),
                lng: parseFloat(subItem.longitude)
              }
            })
          }
        });
        //return filteredResult;
        this.mapFlightRouteAdditionalService.airSigmetArrayEvent.emit(filteredResult);
        return;
      }
      else if (airSigmetDatas != null) {
        if (this.checkPointArrayExistInArea(airSigmetDatas.area.point, maxLat, minLat, maxLong, minLong) == true) {
          let returnedArray = airSigmetDatas.area.point.map(item => {
            return {
              lat: parseFloat(item.latitude),
              lng: parseFloat(item.longitude)
            }
          })
          let returnedResult = {
            type: this.setColorBasedOnAirSigmetType(airSigmetDatas.airsigmet_type),
            pointArray: returnedArray
          }
          this.mapFlightRouteAdditionalService.airSigmetArrayEvent.emit([returnedResult]);
          return;
        }
        else this.mapFlightRouteAdditionalService.airSigmetArrayEvent.emit([]);
      }
      else this.mapFlightRouteAdditionalService.airSigmetArrayEvent.emit([]);
    }
  }

  checkPointArrayExistInArea(data: Array<any>, maxLat: number, minLat: number, maxLong: number, minLong: number) {
    return (data.find((item) => {
      return (item.latitude >= minLat && item.latitude <= maxLat && item.longitude >= minLong && item.longitude <= maxLong);
    }) != null)
  }

  setColorBasedOnAirSigmetType(type: string) {
    switch (type) {
      case "SIGMET": return "#ff3b3b";
      case "AIRMET": return "#ffff75";
      case "OUTLOOK": return "#ffca75";
      default: return "#a3a3a3"
    }
  }
}
