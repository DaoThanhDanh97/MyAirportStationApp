import { Component, OnInit, AfterViewInit, ViewChild, OnDestroy } from '@angular/core';
import { AgmMap, LatLngLiteral, LatLngBounds } from '@agm/core';
import { MapStateBoundaryService } from '../../services/map-state-boundary.service'
import { MapMetarStationsService } from '../../services/map-metar-stations.service';
import { StationDetail } from 'src/app/models/station_detail.model';
import { MapStateInfoService } from '../../services/map-state-info.service'
import { MapViewStateDropdownComponent } from './map-view-state-dropdown/map-view-state-dropdown.component';

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.css'],
  providers: [MapStateBoundaryService, MapMetarStationsService, MapStateInfoService]
})
export class MapViewComponent implements OnInit, AfterViewInit, OnDestroy {
  zoomLevel: number = 4;
  lat: number = 39.8097343;
  long: number = -98.5556199;

  boundaryData: Array<Array<LatLngLiteral>> = [];
  stationsData: Array<StationDetail> = [];

  mapView: any;

  @ViewChild('AgmMap') agmMap: AgmMap;
  @ViewChild('stateDropdown') stateDropdown: MapViewStateDropdownComponent;

  constructor(private mapStateBoundaryService: MapStateBoundaryService, private mapMetarStationsService: MapMetarStationsService) { }

  ngOnInit() {
    this.mapStateBoundaryService.mapData.subscribe(data => {
      this.boundaryData = data;
    })

    this.mapMetarStationsService.stationsEvent.subscribe(data => {
      this.stationsData = data;
    });
  }

  ngAfterViewInit() {
    this.agmMap.mapReady.subscribe((map: any) => {
      this.mapView = map;
      this.mapView.setOptions({
        styles: [
          {
            "featureType": "road",
            "stylers": [
              { "visibility": "off" }
            ]
          },
          {
            "featureType": "administrative.locality",
            "stylers": [
              { "visibility": "off" }
            ]
          }
        ]
      });

      this.mapStateBoundaryService.getBoundaryData();
      this.mapMetarStationsService.getStationsData();
    });

    this.agmMap.zoomChange.subscribe((zoomLevel: number) => {
      this.zoomLevel = zoomLevel;
    })

    this.agmMap.boundsChange.subscribe((data: any) => {
      this.mapMetarStationsService.onBoundaryChange(data.toJSON(), this.zoomLevel);
    })
  }

  ngOnDestroy() {
    this.agmMap.mapReady.unsubscribe();
    this.agmMap.zoomChange.unsubscribe();
    this.agmMap.boundsChange.unsubscribe();
    this.mapStateBoundaryService.mapData.unsubscribe();
    this.mapMetarStationsService.stationsEvent.unsubscribe();
  }

  onPolyClick() {
    console.log("Poly clicked");
  }

  onPointClick() {
    console.log("Point clicked");
  }

  onMoveMap() {
    
  }
}
