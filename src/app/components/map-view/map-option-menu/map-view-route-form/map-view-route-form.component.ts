import { Component, OnInit, ViewChild, ViewChildren, QueryList, AfterViewInit } from '@angular/core';
import { MapMetarStationsService } from 'src/app/services/map-metar-stations.service';
import { MapViewRouteFormInputComponent } from './map-view-route-form-input/map-view-route-form-input.component';
import { MapOptionSelectService } from 'src/app/services/map-option-select.service';
import { MapMarkerService } from 'src/app/services/map-marker.service';
import { SearchLineDirective } from 'src/app/directives/search-line.directive';

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

  @ViewChildren(SearchLineDirective) searchLines: QueryList<SearchLineDirective>;

  constructor(private mapMetarStationsEvent: MapMetarStationsService,
    private mapOptionSelectService: MapOptionSelectService,
    private mapMarkerService: MapMarkerService
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
  }

  ngOnInit() {
    this.mapMetarStationsEvent.stationsByInputEvent.subscribe((value: any) => {
      this.onResultChange(value.result);
      this.currentSearchLocation = value.inputSource;
    })

    this.mapMarkerService.doubleClickEvent.subscribe((value: any) => {
      console.log('Received');
      if(this.currentSearchLocation == '') {
        this.onMarkerClick(value);
      } else {
        this.onItemClick(value);
      }
      this.currentSearchLocation = '';
    })
  }

  ngAfterViewInit() {
    console.log(this.searchLines);
  }

  onResultChange(data: any) {
    this.result = data;
    this.resultListDisplay = (this.result.length > 0) ? 'flex' : 'none';
  }

  onItemClick(item: any) {
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
  }

  onResultDivClick(value: any) {
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
  }

  onChangeMode(value: string) {
    this.mapOptionSelectService.onMapOptionSelectedEvent(value);
  }

  onMarkerClick(item: any) {
    if(this.finalDeparture == '') {
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
    this.isSearchResultVisible = (this.finalArrival != '' && this.finalDeparture != '')? 'visible' : 'hidden';
  }
}
