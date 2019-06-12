import { Component, OnInit, AfterViewInit, ViewChild, OnDestroy } from '@angular/core';
import { AgmMap, LatLngLiteral, LatLngBounds, AgmCircle } from '@agm/core';
import { MapStateBoundaryService } from '../../services/map-state-boundary.service'
import { MapMetarStationsService } from '../../services/map-metar-stations.service';
import { StationDetail } from 'src/app/models/station_detail.model';
import { MapStateInfoService } from '../../services/map-state-info.service'

import * as stateCentersDetail from '../../JSON/state_center.json';
import { SpinnerLayerDirective } from 'src/app/directives/spinner-layer.directive';
import { MapResetService } from 'src/app/services/map-reset.service';
import { MapMarkerService } from 'src/app/services/map-marker.service';
import { MapOptionMenuComponent } from './map-option-menu/map-option-menu.component';

const earthRadius: number = 6371000;

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.css'],
  providers: [MapStateBoundaryService, MapStateInfoService, MapResetService, MapMarkerService]
})
export class MapViewComponent implements OnInit, AfterViewInit, OnDestroy {
  zoomLevel: number = 5;
  lat: number = 39.8097343;
  long: number = -98.5556199;

  //features: any;

  boundaryData: Array<Array<LatLngLiteral>> = [];
  stationsData: Array<StationDetail> = [];

  circleBoundingPoints: Array<{ lat: number, long: number }> = [];
  circleRadius: number = 0;
  circleLat: number;
  circleLong: number;

  selectedState: any;
  mapView: any;
  data_layer: any;
  data_layer2: any;
  featuresNumber: number = 0;
  isCenterChanged: boolean = false;
  isCircleVisible: boolean = false;

  state_JSON: string = 'https://firebasestorage.googleapis.com/v0/b/mydbjson.appspot.com/o/us_state.json?alt=media&token=f4135f44-430a-41c6-8e64-5e3e45d73954';
  county_JSON: string = 'https://firebasestorage.googleapis.com/v0/b/mydbjson.appspot.com/o/us_county_geojson.json?alt=media&token=0405f96b-3dcb-4ae2-81b3-1a1f8d85c7a1';

  @ViewChild('AgmMap') agmMap: AgmMap;
  @ViewChild(SpinnerLayerDirective) spinnerLayer: SpinnerLayerDirective;
  @ViewChild('agmCircle', { read: AgmCircle }) agmCircle: AgmCircle;
  @ViewChild('appMapOptionMenu') mapOptionMenuComponent: MapOptionMenuComponent

  //airport mode
  modeSelected: string = '';


  constructor(private mapStateBoundaryService: MapStateBoundaryService,
    private mapMetarStationsService: MapMetarStationsService,
    private mapStateInfoService: MapStateInfoService,
    private mapResetService: MapResetService,
    private mapMarkerService: MapMarkerService) {
    this.circleLat = this.lat;
    this.circleLong = this.long;
  }

  ngOnInit() {
    this.mapStateBoundaryService.mapData.subscribe(data => {
      this.boundaryData = data;
    })

    this.mapMetarStationsService.stationsEvent.subscribe(data => {
      this.stationsData = data;
    });

    this.mapStateInfoService.stateData.subscribe((data: any) => {
      this.zoomLevel = 7;

      this.mapView.panTo({
        lat: data.lat,
        lng: data.long
      })
    })

    this.mapMetarStationsService.getStationToMoveEvent.subscribe((data: any) => {
      //console.log(data);
      this.zoomLevel = 10;

      this.mapView.panTo({
        lat: data.lat,
        lng: data.long
      })
    })

    this.mapResetService.mapResetEvent.subscribe(() => {
      this.onResetEvent();
    })

    this.mapMarkerService.clickEvent.subscribe((data: any) => {
      this.zoomLevel = 10;
      this.mapView.panTo({
        lat: data.lat,
        lng: data.long
      })

      if (this.modeSelected == 'airport_find') {
        //this.mapOptionMenuComponent.airportModeClickTriggerEvent(data);
        this.mapMarkerService.onAirportModeClickEvent(data);
      }
    })
  }

  ngAfterViewInit() {
    this.agmMap.mapReady.subscribe((map: any) => {
      this.mapView = map;
      this.mapView.setOptions({
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
      this.mapStateInfoService.getStatesInfo();

      this.data_layer = new google.maps.Data({
        map: this.mapView
      })

      this.data_layer.loadGeoJson(this.county_JSON);

      this.data_layer.setStyle({
        strokeWeight: 1,
        fillColor: 'green',
        fillOpacity: 0.1,
        strokeColor: 'rgb(200, 200, 200)',
        clickable: false
      })

      this.data_layer2 = new google.maps.Data({
        map: this.mapView
      });

      this.data_layer2.loadGeoJson(this.state_JSON);

      this.data_layer2.setStyle({
        strokeWeight: 3,
        fillColor: 'transparent',
        strokeColor: 'rgb(100, 100, 100)',
        zIndex: 1
      })

      this.data_layer2.addListener('click', (event: any) => {
        //console.log(event.feature.getProperty('STATE_ABBR'));
        this.mapMetarStationsService.setClickTrigger(true);

        this.mapStateInfoService.getStateToChange(event.feature.getProperty('STATE_ABBR'));
      })

      this.data_layer2.addListener('rightclick', (event: any) => {
        //console.log(event.latLng.lat());
        if(this.modeSelected == 'area_find') {
          this.addToCircleBoundingPoint(event.latLng.lat(), event.latLng.lng())
        }
      })

      setTimeout(() => {
        this.spinnerLayer.onLoadComplete()
      }, 8000);
    });

    this.agmMap.boundsChange.subscribe((data: any) => {
      this.mapMetarStationsService.onBoundaryChange(data.toJSON(), this.zoomLevel);
      //console.log("Changed");
    })
  }

  ngOnDestroy() {
    this.agmMap.mapReady.unsubscribe();
    this.agmMap.zoomChange.unsubscribe();
    this.agmMap.boundsChange.unsubscribe();
    this.mapStateBoundaryService.mapData.unsubscribe();
    this.mapMetarStationsService.stationsEvent.unsubscribe();
  }

  onPointClick() {
    console.log("Point clicked");
  }

  onCircleClick() {
    console.log("Circle clicked");
  }

  zoomMapEventHandler(event: any) {
    //console.log(event);
    this.mapMetarStationsService.setClickTrigger(false);

    this.zoomLevel = event;
  }

  onZoomChange(event: any) {
    this.zoomLevel = event;
  }

  onRightClickMap(event: any) {
    console.log(event);
  }

  onResetEvent() {
    this.zoomLevel = 5;

    this.mapView.panTo({
      lat: 39.8097343,
      lng: -98.5556199
    })
  }

  addToCircleBoundingPoint(lat: number, long: number) {
    if (this.circleBoundingPoints.length < 2) {
      this.circleBoundingPoints.push({ lat, long });

      if (this.circleBoundingPoints.length == 2) {
        this.circleRadius = google.maps.geometry.spherical.computeDistanceBetween(
          new google.maps.LatLng(this.circleBoundingPoints[0].lat, this.circleBoundingPoints[0].long),
          new google.maps.LatLng(this.circleBoundingPoints[1].lat, this.circleBoundingPoints[1].long)
        ) / 2

        let pointCenter = google.maps.geometry.spherical.interpolate(
          new google.maps.LatLng(this.circleBoundingPoints[0].lat, this.circleBoundingPoints[0].long),
          new google.maps.LatLng(this.circleBoundingPoints[1].lat, this.circleBoundingPoints[1].long),
          0.5          
        ).toJSON();

        this.circleLat = pointCenter.lat;

        this.circleLong = pointCenter.lng;

        this.circleBoundingPoints = [];
      }
    }
  }

  onCenterChange(event: any) {
    this.circleLat = event.lat;
    this.circleLong = event.lng;

    this.isCenterChanged = true;

    this.agmCircle.getBounds().then((boundary: any) => {
      this.mapMetarStationsService.getBoundingAreaClickEvent(boundary.toJSON(), this.circleLat, this.circleLong, this.circleRadius)
    });
  }

  onRadiusChange(event: any) {
    this.circleRadius = event;

    if (this.isCenterChanged == true) {
      this.isCenterChanged = false;
      return;
    }
    else {
      this.agmCircle.getBounds().then((boundary: any) => {
        this.mapMetarStationsService.getBoundingAreaClickEvent(boundary.toJSON(), this.circleLat, this.circleLong, this.circleRadius)
      });
    }
  }

  updateMode(event: string) {
    this.onResetEvent();
    this.modeSelected = event;
    this.isCircleVisible = false;
  }
}