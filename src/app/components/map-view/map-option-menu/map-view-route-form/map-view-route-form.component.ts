import { Component, OnInit, ViewChild } from '@angular/core';
import { MapMetarStationsService } from 'src/app/services/map-metar-stations.service';
import { MapViewRouteFormInputComponent } from './map-view-route-form-input/map-view-route-form-input.component';

@Component({
  selector: 'app-map-view-route-form',
  templateUrl: './map-view-route-form.component.html',
  styleUrls: ['./map-view-route-form.component.css']
})
export class MapViewRouteFormComponent implements OnInit {
  currentSearchLocation: string = '';
  currentResults: Array<any> = [];

  suggestionDisplay: string = 'none';
  
  @ViewChild('routeStart') routeStart: MapViewRouteFormInputComponent;
  @ViewChild('routeEnd') routeEnd: MapViewRouteFormInputComponent;

  constructor(private mapMetarStationsService: MapMetarStationsService) { }

  ngOnInit() {
    this.mapMetarStationsService.stationsByInputEvent.subscribe((data: any) => {
      //console.log(data);
      this.currentResults = data.result;
      this.suggestionDisplay = (this.currentResults.length == 0)? 'none' : 'block';
      this.currentSearchLocation = data.inputSource;
    })
  }

  onPointSelected(event: any) {
    console.log(event);
  }

  onStationSearchUpdate(value: any) {
    this.mapMetarStationsService.onInputChange(value.value, value.src);
  }

  onSuggestionClick(value: any) {
    //console.log(this.currentSearchLocation);
    if (this.currentSearchLocation == 'departure') {
      this.routeStart.onReceivedUpdate(value);
    }
    else {
      this.routeEnd.onReceivedUpdate(value);
    }

    this.currentResults = [];
    this.mapMetarStationsService.getMoveDestination(value.airportCode);
    this.suggestionDisplay = 'none';
  }

  showRoute() {
    if(this.routeStart.stationCode === '' || this.routeEnd.stationCode === '') {
      alert('Please select both departure and arrival!');
    }
    else {
      console.log('Succeeded!')
    }
  }
}
