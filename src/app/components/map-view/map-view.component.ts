import { DashboardService } from './../../services/dashboard.service';
import { Component, OnInit, AfterViewInit, ViewChild, OnDestroy, ViewChildren, QueryList } from '@angular/core';
import { AgmMap, LatLngLiteral, LatLngBounds, AgmCircle } from '@agm/core';
import { MapStateBoundaryService } from '../../services/map-state-boundary.service';
import { MapMetarStationsService } from '../../services/map-metar-stations.service';
import { StationDetail } from 'src/app/models/station_detail.model';
import { MapStateInfoService } from '../../services/map-state-info.service';
import { SpinnerLayerDirective } from 'src/app/directives/spinner-layer.directive';
import { MapResetService } from 'src/app/services/map-reset.service';
import { MapMarkerService } from 'src/app/services/map-marker.service';
import { MapOptionMenuComponent } from './map-option-menu/map-option-menu.component';
import { MapOptionSelectService } from 'src/app/services/map-option-select.service';
import { NgxXml2jsonService } from 'ngx-xml2json';
import { TafResponse } from 'src/app/models/taf-response.model';
import { MapFlightRouteAdditionalService } from 'src/app/services/map-flight-route-additional.service';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { Data24hService } from 'src/app/services/data-24h.service';
import { OptionMenuDirective } from 'src/app/directives/option-menu.directive';
import { MapViewMarkerComponent } from './map-view-marker/map-view-marker.component';

const earthRadius: number = 6371000;

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.css'],
  providers: [MapStateBoundaryService, MapStateInfoService, MapResetService, MapMarkerService, MapOptionSelectService, MapFlightRouteAdditionalService, Data24hService],
  animations: [
    trigger('appearHidden', [
      state('appear', style({
        transform: 'translateX(0)'
      })),
      state('hidden', style({
        transform: 'translateX(-100%)'
      })),
      transition('hidden => appear', [animate('0.2s ease-in')]),
      transition('appear => hidden', [animate('0.3s ease-out')])
    ])
  ]
})
export class MapViewComponent implements OnInit, AfterViewInit, OnDestroy {
  zoomLevel: number = 5;
  lat: number = 39.8097343;
  long: number = -98.5556199;
  metarReportDivStatus: string = 'hidden';

  //features: any;

  boundaryData: Array<Array<LatLngLiteral>> = [];
  stationsData: Array<StationDetail> = [];
  flightResultData: Array<StationDetail> = [];

  //flight mode - foor checking if all points have been called
  flightResultCalled: Array<any> = [];

  startAirport: string = '';
  arriveAirport: string = '';

  areaStationsData: Array<StationDetail> = [];
  isAreaFound: boolean = false;
  foundCase: string = 'default';

  circleBoundingPoints: Array<{ lat: number, long: number }> = [];
  circleRadius: number = 0;
  circleLat: number;
  circleLong: number;

  mapView: any;
  data_layer: any;
  data_layer2: any;
  featuresNumber: number = 0;
  isCenterChanged: boolean = false;
  isCircleVisible: boolean = false;
  circleLayer: any;

  state_JSON: string = 'https://firebasestorage.googleapis.com/v0/b/mydbjson.appspot.com/o/us_state.json?alt=media&token=f4135f44-430a-41c6-8e64-5e3e45d73954';
  county_JSON: string = 'https://firebasestorage.googleapis.com/v0/b/mydbjson.appspot.com/o/us_county_geojson.json?alt=media&token=0405f96b-3dcb-4ae2-81b3-1a1f8d85c7a1';

  metarDetailDivMarginTop: string = '0px';

  isMarkerSelected: boolean = false;
  selectedStation: string = '';

  isResetted: boolean = false;

  searchResultDisplay: string = "none";
  searchResult: any;
  markerList: any;

  @ViewChild('AgmMap') agmMap: AgmMap;
  @ViewChild(SpinnerLayerDirective) spinnerLayer: SpinnerLayerDirective;
  @ViewChild('agmCircle', { read: AgmCircle }) agmCircle: AgmCircle;
  @ViewChild('appMapOptionMenu') mapOptionMenuComponent: MapOptionMenuComponent;
  @ViewChild(OptionMenuDirective) mapOptionMenuDirective: OptionMenuDirective;

  @ViewChildren(MapViewMarkerComponent) mapMarkerComponents: QueryList<MapViewMarkerComponent>;

  airSigmetInfoDisplay: string = 'none';

  //airport mode
  modeSelected: string = '';
  isPathFound: boolean = false;

  flightLayer: any;
  flightStartAirport: string = "";
  flightDeparture: StationDetail;
  flightArrival: StationDetail;
  flightDepartureAvailable: boolean = false;
  flightArrivalAvailable: boolean = false;
  flightForecastResults: Array<any> = [];
  isInitialFlightBoundaryReceived: boolean = false;

  airSigmetArray: Array<any> = [];

  constructor(private mapStateBoundaryService: MapStateBoundaryService,
    private mapMetarStationsService: MapMetarStationsService,
    private mapStateInfoService: MapStateInfoService,
    private mapResetService: MapResetService,
    private mapMarkerService: MapMarkerService,
    private mapOptionSelectService: MapOptionSelectService,
    private xmlJson: NgxXml2jsonService,
    private mapFlightRouteAdditionalService: MapFlightRouteAdditionalService,
    private data24hService: Data24hService) {
    this.circleLat = this.lat;
    this.circleLong = this.long;
    this.modeSelected = 'airport_find';
    this.searchResult = {
      latitude: 0,
      longitude: 0,
      airportCode: "",
      temperatureValue: 0,
      windDegreeValue: 0,
      windSpeedValue: "",
      visibilityValue: "",
      altimeterValue: 0,
      dewPointValue: 0,
      cloudCoverValue: "",
      cloudFtValue: "",
      flightCategory: "",
      observationValue: "",
      transformValue: "",
      flightCategoryColor: "",
      svgIconSource: ""
    }
  }

  ngOnInit() {
    this.mapStateBoundaryService.mapData.subscribe(data => {
      if (!this.isPathFound) {
        this.boundaryData = data;
      }
    })

    this.mapMetarStationsService.stationsEvent.subscribe(data => {
      if (this.circleLayer == null || this.circleLayer.getVisible() == false) {
        this.stationsData = data;
        this.areaStationsData = [];
      }
      else {
        this.stationsData = [];
        this.areaStationsData = data;
      }
      if (this.isPathFound) {
        this.stationsData = [];
        this.areaStationsData = [];
      }
      //console.log(this.isMarkerSelected);
      if (this.isMarkerSelected) {
        this.mapMarkerComponents.toArray().forEach((component) => {
          component.onStationSelected(this.selectedStation);
        })
        this.isMarkerSelected = false;
      }

      //reset all markers
      if (this.isResetted) {
        this.mapMarkerComponents.toArray().forEach((component) => {
          component.resetMarker();
        })
      }

      if (this.searchResultDisplay != 'none') {
        this.mapMarkerComponents.toArray().forEach((component) => {
          component.onMarkerSelectionUpdate(this.searchResult.airportCode);
        })
      }
    });

    this.mapStateInfoService.stateData.subscribe((data: any) => {
      this.zoomLevel = 7;

      this.mapView.panTo({
        lat: data.lat,
        lng: data.long
      })
    })

    this.mapMetarStationsService.getStationToMoveEvent.subscribe((data: any) => {
      this.zoomLevel = 10;
      if (this.modeSelected == 'airport_find') {
        this.isMarkerSelected = true;
      }
      this.selectedStation = data.airportCode;
      this.mapView.panTo({
        lat: data.lat,
        lng: data.long
      })
    })

    this.mapResetService.mapResetEvent.subscribe(() => {
      this.onResetEvent();
    })

    this.mapResetService.dashboardResetEvent.subscribe(() => {
      this.metarReportDivStatus = 'hidden';

    })

    this.mapMarkerService.clickEvent.subscribe((data: any) => {
      this.zoomLevel = 10;
      this.mapView.panTo({
        lat: data.lat,
        lng: data.long
      })

      if (this.metarReportDivStatus == 'appear') {
        this.data24hService.resetDataEvent.emit(data.airportCode);
      }

      if (this.modeSelected == 'airport_find') {
        this.mapMarkerService.onAirportModeClickEvent(data);
      };
    })

    this.mapMarkerService.doubleClickEvent.subscribe((data: any) => {
      if (this.startAirport == '') {
        this.startAirport = data.airportCode;
      }
      else if (this.arriveAirport == '') {
        this.arriveAirport = data.airportCode;
      }
    })

    this.mapOptionSelectService.mapOptionSelected.subscribe((value: string) => {
      this.updateMode(value);
    })

    this.mapResetService.areaResetEvent.subscribe(() => {
      this.circleBoundingPoints = [];
      this.updateMode(this.modeSelected);
    })

    this.mapMetarStationsService.flightStationsEvent.subscribe((data: any) => {
      this.spinnerLayer.onLoadStart();
      this.flightStartAirport = data.departure.airportCode;
      this.flightDeparture = data.departure;
      this.flightArrival = data.arrival;
      this.flightResultData = data.stationsList;
      this.flightArrivalAvailable = true;
      this.flightDepartureAvailable = true;
      this.isPathFound = true;
      this.stationsData = [];
      this.areaStationsData = [];
      this.callTafResults();
    })

    this.mapFlightRouteAdditionalService.resetBoundaryDataEvent.subscribe(() => {
      console.log("Called");
      if (this.foundCase == 'flightFound' && this.flightForecastResults != null) {
        let latList = this.flightForecastResults.map(item => item.lat);
        let lngList = this.flightForecastResults.map(item => item.long);

        let flightBoundary = new google.maps.LatLngBounds(
          new google.maps.LatLng(Math.min(...latList), Math.min(...lngList)),
          new google.maps.LatLng(Math.max(...latList), Math.max(...lngList))
        )

        this.mapView.fitBounds(flightBoundary);
      }
    })

    this.mapFlightRouteAdditionalService.onInitialRouteBoundaryReceived.subscribe(() => this.isInitialFlightBoundaryReceived = true);

    this.mapFlightRouteAdditionalService.returnToDefaultMode.subscribe((data: any) => {
      this.foundCase = '';
      this.isPathFound = false;
      this.mapMetarStationsService.onBoundaryChange(this.mapView.getBounds().toJSON(), this.zoomLevel);
      if (data == 'departure') {
        this.flightDepartureAvailable = false;
        this.flightDeparture = null;
      }
      if (data == 'arrival') {
        this.flightArrivalAvailable = false;
        this.flightArrival = null;
      }
      this.airSigmetArray.forEach((item) => {
        item.setMap(null);
      })
      this.airSigmetArray = [];
      this.airSigmetInfoDisplay = 'none';
    })

    this.mapMetarStationsService.flightMarkerEvent.subscribe((data: any) => {
      if (data.type == 'flightSearchDeparture') {
        this.flightDepartureAvailable = true;
        this.flightDeparture = data.stationDetail;
      }
      if (data.type == 'flightSearchArrival') {
        this.flightArrivalAvailable = true;
        this.flightArrival = data.stationDetail;
      }
      this.stationsData = this.stationsData.filter(item => item.airportCode != data.stationDetail.airportCode);
    })

    this.data24hService.metarDetailClickEvent.subscribe(() => {
      this.metarReportDivStatus = 'appear';
    })

    this.data24hService.closeMetarDetailEvent.subscribe(() => {
      this.metarReportDivStatus = 'hidden';
    })

    this.mapFlightRouteAdditionalService.airSigmetArrayEvent.subscribe((data: Array<any>) => {
      // console.log(data);
      // this.airSigmetArray = data;
      data.forEach((item) => {
        this.airSigmetArray.push(this.createAirSigmetPolygon(item));
      })
      this.airSigmetInfoDisplay = 'flex';
    })

    this.mapMarkerService.searchByClickEvent.subscribe((data: any) => {
      if (this.mapMarkerComponents.toArray().length > 0) {
        this.mapMarkerComponents.toArray().forEach((component) => {
          component.onMarkerSelectionUpdate(data.airportCode);
        })
      }
      this.searchResult = data;
      this.searchResultDisplay = "flex";
    })

    this.mapResetService.resetSearchResult.subscribe(() => {
      this.searchResultDisplay = "none";
      this.searchResult = {
        latitude: 0,
        longitude: 0,
        airportCode: "",
        temperatureValue: 0,
        windDegreeValue: 0,
        windSpeedValue: "",
        visibilityValue: "",
        altimeterValue: 0,
        dewPointValue: 0,
        cloudCoverValue: "",
        cloudFtValue: "",
        flightCategory: "",
        observationValue: "",
        transformValue: "",
        flightCategoryColor: "",
        svgIconSource: ""
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

      this.data_layer.setStyle({
        strokeWeight: 1,
        fillColor: '#edebe8',
        fillOpacity: 1,
        strokeColor: 'rgb(200, 200, 200)',
        clickable: false,
      })

      this.data_layer.loadGeoJson(this.county_JSON);

      this.data_layer2 = new google.maps.Data({
        map: this.mapView
      });

      this.data_layer2.setStyle({
        strokeWeight: 3,
        fillColor: 'transparent',
        strokeColor: 'rgb(100, 100, 100)',
        zIndex: 1
      })

      this.data_layer2.loadGeoJson(this.state_JSON);

      this.data_layer2.addListener('click', (event: any) => {
        //console.log(event.feature.getProperty('STATE_ABBR'));
        this.mapMetarStationsService.setClickTrigger(true);

        if ((this.modeSelected === 'area_find' && this.circleLayer != null && this.circleLayer.getVisible() == true) || (this.modeSelected == 'flight_find' && this.flightArrivalAvailable && this.flightDepartureAvailable)) return;

        this.mapStateInfoService.getStateToChange(event.feature.getProperty('STATE_ABBR'));
      })

      this.data_layer2.addListener('rightclick', (event: any) => {
        //console.log(event.latLng.lat());
        if (this.modeSelected == 'area_find') {
          this.addToCircleBoundingPoint(event.latLng.lat(), event.latLng.lng())
        }
      })

      this.circleLayer = new google.maps.Circle({
        strokeColor: '#54adaa',
        strokeOpacity: 0.8,
        fillColor: '#54adaa',
        fillOpacity: 0.35,
        map: this.mapView,
        center: { lat: 0, lng: 0 },
        radius: 0,
        zIndex: 2,
        visible: false,
        editable: true
      })

      this.circleLayer.addListener('center_changed', (event: any) => {
        if (this.circleLayer.getVisible() != false) {
          this.circleBoundingPoints = [];
          this.mapMetarStationsService.setClickTrigger(true);
          this.mapMetarStationsService.getBoundingAreaClickEvent(this.circleLayer.getCenter().lat(), this.circleLayer.getCenter().lng(), this.circleLayer.getRadius());
          this.mapView.panTo({
            lat: this.circleLayer.getCenter().lat(),
            lng: this.circleLayer.getCenter().lng()
          })
        }
        else {
          this.mapMetarStationsService.setClickTrigger(false);
        }
      })

      this.circleLayer.addListener('radius_changed', () => {
        if (this.circleLayer.getVisible() != false) {
          this.circleBoundingPoints = [];
          this.mapMetarStationsService.setClickTrigger(true);
          this.mapMetarStationsService.getBoundingAreaClickEvent(this.circleLayer.getCenter().lat(), this.circleLayer.getCenter().lng(), this.circleLayer.getRadius());
          this.mapView.panTo({
            lat: this.circleLayer.getCenter().lat(),
            lng: this.circleLayer.getCenter().lng()
          })
        }
        else {
          this.mapMetarStationsService.setClickTrigger(false);
        }
      })

      setTimeout(() => {
        this.spinnerLayer.onLoadComplete()
      }, 8000);
    });

    this.metarDetailDivMarginTop = this.mapOptionMenuDirective.checkNativeElement() + "px";

    this.agmMap.boundsChange.subscribe((data: any) => {
      this.mapMetarStationsService.onBoundaryChange(data.toJSON(), this.zoomLevel);

      if (this.foundCase == 'flightFound' && this.isInitialFlightBoundaryReceived == true) {
        this.mapFlightRouteAdditionalService.onMapBoundaryUpdate.emit(data.toJSON());
      }
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
    if (this.modeSelected == 'area_find' && this.circleLayer != null && this.circleLayer.getVisible() != false) {
      this.zoomLevel = event;
      return;
    }
    this.mapMetarStationsService.setClickTrigger(false);
    this.zoomLevel = event;
  }

  onZoomChange(event: any) {
    this.zoomLevel = event;
  }

  onRightClickMap(event: any) {
    //console.log(event);
    if (this.modeSelected == 'area_find') {
      this.addToCircleBoundingPoint(event.coords.lat, event.coords.lng);
    }
  }

  onResetEvent() {
    this.mapMetarStationsService.setClickTrigger(false);
    this.mapResetService.resetSearchResult.emit();

    this.zoomLevel = 5;

    this.mapView.panTo({
      lat: 39.8097343,
      lng: -98.5556199
    })

    this.isResetted = true;

    this.mapMetarStationsService.onBoundaryChange(this.mapView.getBounds().toJSON(), this.zoomLevel);
  }

  addToCircleBoundingPoint(lat: number, long: number) {
    if (this.circleBoundingPoints.length < 2 && this.foundCase != 'areaFound') {
      this.circleBoundingPoints.push({ lat, long });
      this.mapView.panTo(this.mapView.getCenter().toJSON());

      if (this.circleBoundingPoints.length == 2) {
        let circleRadius = google.maps.geometry.spherical.computeDistanceBetween(
          new google.maps.LatLng(this.circleBoundingPoints[0].lat, this.circleBoundingPoints[0].long),
          new google.maps.LatLng(this.circleBoundingPoints[1].lat, this.circleBoundingPoints[1].long)
        ) / 2

        let pointCenter = google.maps.geometry.spherical.interpolate(
          new google.maps.LatLng(this.circleBoundingPoints[0].lat, this.circleBoundingPoints[0].long),
          new google.maps.LatLng(this.circleBoundingPoints[1].lat, this.circleBoundingPoints[1].long),
          0.5
        ).toJSON();

        this.circleLayer.setOptions({
          visible: true,
          center: pointCenter,
          radius: circleRadius,
        })

        this.isAreaFound = true;
        this.foundCase = 'areaFound';

        this.mapOptionMenuComponent.onResetAreaButton();
      }
    }
  }


  updateMode(event: string) {
    this.onResetEvent();
    this.modeSelected = event;
    this.isCircleVisible = false;
    this.circleBoundingPoints = [];
    this.circleLayer.setOptions({
      visible: false,
      center: { lat: 0, lng: 0 },
      radius: 0,
    })
    this.isAreaFound = false;
    this.foundCase = 'default';
    this.areaStationsData = [];
    this.flightResultData = [];
    this.isPathFound = false;

    this.flightStartAirport = "";
    this.flightArrival = null;
    this.flightDeparture = null;
    this.flightDepartureAvailable = false;
    this.flightArrivalAvailable = false;
    this.isInitialFlightBoundaryReceived = false;

    if (this.flightLayer != null) {
      this.flightLayer.setMap(null);
    }

    this.metarReportDivStatus = 'hidden';
    this.airSigmetArray.forEach((item) => {
      item.setMap(null);
    })
    this.airSigmetArray = [];
    this.airSigmetInfoDisplay = 'none';
  }

  async callTafResults() {
    let tafResultList = new Array<any>();
    for (let ind = 0; ind < this.flightResultData.length; ind++) {
      let tafStation = this.flightResultData[ind];

      let callTimeAction = await fetch('https://flighttime-calculator.com/calculate?lat1=' + this.flightDeparture.lat + '&lng1=' + this.flightDeparture.long + '&lat2=' + tafStation.lat + '&lng2=' + tafStation.long);
      let callTimeRes = await callTimeAction.json();

      if (callTimeRes.flight_time != null) {
        let currentTime = new Date();
        let addedHours = parseInt(callTimeRes.flight_time.split(" ")[0].replace(/\D/g, ""));
        let addedMinutes = parseInt(callTimeRes.flight_time.split(" ")[1].replace(/\D/g, ""));
        let currentTimeYst = new Date(currentTime.getUTCFullYear(), currentTime.getMonth(), currentTime.getDate() - 1,
          currentTime.getHours(), currentTime.getMinutes());
        let arriveTime = new Date(currentTime.getUTCFullYear(), currentTime.getMonth(), currentTime.getDate(),
          currentTime.getHours() + addedHours, currentTime.getMinutes() + addedMinutes);
        let currentTimeYstISO = currentTimeYst.toISOString();
        let arriveTimeISO = arriveTime.toISOString();
        let tafCall = await fetch('https://www.aviationweather.gov/adds/dataserver_current/httpparam?dataSource=tafs&requestType=retrieve&format=xml&startTime='
          + currentTimeYstISO + '&endTime=' + arriveTimeISO + '&stationString=' + tafStation.airportCode
        );
        let tafRes = await tafCall.text();

        let parser = new DOMParser();
        let xml = parser.parseFromString(tafRes, 'text/xml');

        let tafResponse = new TafResponse(this.xmlJson.xmlToJson(xml)).getResponse();

        let tafResult = (Array.isArray(tafResponse.data.TAF)) ? tafResponse.data.TAF[0] : tafResponse.data.TAF;

        if (tafResult != null) {
          let fcstResults = tafResult.forecast;
          let possibleForecast = (Array.isArray(fcstResults)) ? fcstResults.find(item => (new Date(item.fcst_time_to).getTime() - arriveTime.getTime() > 0)) : fcstResults;

          let fcstSkyCondition = <any>{};

          if (possibleForecast.sky_condition != null) {
            fcstSkyCondition = (Array.isArray(possibleForecast.sky_condition) ? possibleForecast.sky_condition[0]["@attributes"] : possibleForecast.sky_condition["@attributes"]);
          }
          else {
            fcstSkyCondition = {
              sky_cover: ""
            }
          }

          tafResultList.push({
            lat: tafStation.lat,
            long: tafStation.long,
            airportName: tafStation.airportName,
            airportCode: tafStation.airportCode,
            svgIconSource: this.getSourceIcon(fcstSkyCondition.sky_cover),
            visibilityValue: possibleForecast.visibility_statute_mi,
            windSpeedValue: possibleForecast.wind_speed_kt + " kt",
            transformValue: this.getTransformValue(possibleForecast.wind_dir_degrees),
          })
        }
      }
    }
    this.flightForecastResults = tafResultList;
    this.spinnerLayer.onLoadComplete();

    let latList = this.flightForecastResults.map(item => item.lat);
    let lngList = this.flightForecastResults.map(item => item.long);

    let flightBoundary = new google.maps.LatLngBounds(
      new google.maps.LatLng(Math.min(...latList), Math.min(...lngList)),
      new google.maps.LatLng(Math.max(...latList), Math.max(...lngList))
    )

    this.foundCase = 'flightFound';

    setTimeout(() => {
      this.mapView.fitBounds(flightBoundary);
      this.mapFlightRouteAdditionalService.onFlightDataLoadComplete.emit(flightBoundary.toJSON());
    }, 0);
  }

  getSourceIcon(category: string) {
    switch (category) {
      case "SKC": return "cloud_CLR";
      case "FEW": return "cloud_FEW";
      case "SCT": return "cloud_SCT";
      case "BKN": return "cloud_BKN";
      case "OVC": return "cloud_OVC";
      default: return "";
    }
  }

  getTransformValue(value: number) {
    return "rotate(" + value + "deg)"
  }

  createAirSigmetPolygon(data: any) {
    return new google.maps.Polygon({
      paths: data.pointArray,
      strokeColor: data.type,
      strokeOpacity: 0.8,
      fillColor: data.type,
      fillOpacity: 0.35,
      zIndex: 2,
      map: this.mapView
    })
  }
}