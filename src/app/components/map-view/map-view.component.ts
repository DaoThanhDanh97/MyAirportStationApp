import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { GoogleMapsAPIWrapper, AgmMap, LatLngBounds, LatLngBoundsLiteral, LatLngLiteral } from '@agm/core';
import { MapStateBoundaryService } from '../../services/map-state-boundary.service'
import { MapMetarStationsService } from '../../services/map-metar-stations.service';
//import { google } from '@agm/core/services/google-maps-types';

//declare var google: any;

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.css'],
  providers: [MapStateBoundaryService, MapMetarStationsService]
})
export class MapViewComponent implements OnInit, AfterViewInit {
  lat: number = 51.678418;
  lng: number = 7.809007;

  boundaryData: Array<Array<LatLngLiteral>> = [];
  stationsData: Array<{lat: number, long: number}> = [];

  @ViewChild('AgmMap') agmMap: AgmMap;

  constructor(private mapStateBoundaryService: MapStateBoundaryService, private mapMetarStationsService: MapMetarStationsService) { }

  ngOnInit() {
    this.mapStateBoundaryService.mapData.subscribe(data => {
      this.boundaryData = data;
    })

    this.mapMetarStationsService.stationsEvent.subscribe(data => {
      this.stationsData = data;
    })
  }

  ngAfterViewInit() {
    this.agmMap.mapReady.subscribe(map => {
      map.setOptions({
        backgroundColor: '#fff !important',
        restriction: {
          latLngBounds: {
            north: 49.3457868,
            west: -124.7844079,
            east: -66.9513812,
            south: 24.7433195
          },
          strictBounds: false,
        },
        minZoom: 4,
        zoom: 4,
        styles: [
          {
            "featureType": "all",
            "stylers": [
              { "visibility": "off" }
            ]
          }
        ]
      });

      this.mapStateBoundaryService.getBoundaryData();
      this.mapMetarStationsService.getStationsData();
    });
  }
}
