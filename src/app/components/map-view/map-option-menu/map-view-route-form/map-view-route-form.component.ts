import { Component, OnInit, ViewChild, ViewChildren, QueryList, AfterViewInit } from '@angular/core';
import { MapMetarStationsService } from 'src/app/services/map-metar-stations.service';
import { MapViewRouteFormInputComponent } from './map-view-route-form-input/map-view-route-form-input.component';
import { MapOptionSelectService } from 'src/app/services/map-option-select.service';
import { MapMarkerService } from 'src/app/services/map-marker.service';
import { SearchLineDirective } from 'src/app/directives/search-line.directive';
import { MapFlightRouteAdditionalService } from 'src/app/services/map-flight-route-additional.service';

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

  @ViewChildren(SearchLineDirective) searchLines: QueryList<SearchLineDirective>;

  constructor(private mapMetarStationsEvent: MapMetarStationsService,
    private mapOptionSelectService: MapOptionSelectService,
    private mapMarkerService: MapMarkerService,
    private mapFlightRouteAdditionalService: MapFlightRouteAdditionalService
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
      if(this.currentSearchLocation == '') {
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
      if(data.north != this.initialBoundary.north || data.south != this.initialBoundary.south 
        || data.west != this.initialBoundary.west || data.east != this.initialBoundary.east) {
          if(this.finalArrival != "" && this.finalDeparture != "") {
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
    this.mapFlightRouteAdditionalService.returnToDefaultMode.emit(value);
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

  onRouteFindAction() {
    this.mapMetarStationsEvent.onRouteFindAction(this.finalDeparture, this.finalArrival);
  }

  onResetMapViewClick() {
    console.log('Clicked');
    this.mapFlightRouteAdditionalService.resetBoundaryDataEvent.emit();
  }
}
