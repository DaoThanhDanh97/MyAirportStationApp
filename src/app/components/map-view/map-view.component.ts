import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { GoogleMapsAPIWrapper, AgmMap, LatLngBounds, LatLngBoundsLiteral} from '@agm/core';
//import { google } from '@agm/core/services/google-maps-types';

declare var google: any;

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.css']
})
export class MapViewComponent implements OnInit, AfterViewInit {
  lat: number = 51.678418;
  lng: number = 7.809007;

  @ViewChild('AgmMap') agmMap: AgmMap;

  mapBound: LatLngBounds;

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.agmMap.mapReady.subscribe(map => {
      this.mapBound = new google.maps.LatLngBounds(
        new google.maps.LatLng(10, 10),
        new google.maps.LatLng(-10, -10),
      )
    })
  }
}
