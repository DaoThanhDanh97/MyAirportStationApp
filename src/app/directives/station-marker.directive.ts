import { Directive, ElementRef, Renderer2, HostListener, EventEmitter } from '@angular/core';
import { NgxXml2jsonService } from 'ngx-xml2json';
import { MapMarkerService } from '../services/map-marker.service';

//var parser = require('xml2json');

@Directive({
  selector: '[appStationMarker]'
})
export class StationMarkerDirective {
  jsonResult: any;

  prevent: boolean = false;

  isDbClicked: boolean = false;
  isClicked: boolean = false;

  timer: any = 0;

  returnedJSON = {
    lat: 0,
    long: 0,
    airportCode: "",
    airportName: "",
    observationTime: "",
    altimeterSetting: 0,
    dewPoint: 0,
    temperature: 0,
    windSpeedKt: 0,
    visibilityStatueMiles: 0,
    windDegree: 0,
    skyCondition: [],
    flightCategory: "",
  }

  returnDbClick = {
    lat: 0,
    long: 0,
    airportCode: "",
    airportName: "",    
  }

  constructor(private elementRef: ElementRef, 
    private renderer: Renderer2, 
    private xmlJson: NgxXml2jsonService,
    private mapMarkerService: MapMarkerService) { }

  @HostListener('click', ['$event.target']) onSingleClick(event: any) {
    this.timer = setTimeout(() => {
      if (this.prevent == false) {
        //console.log(self);
        this.onMarkerClick(this.elementRef.nativeElement);
      }
      this.prevent = false;
    }, 200);
  }

  @HostListener('dblclick', ['$event.target']) onDoubleClick(event: any) {
    clearTimeout(this.timer);
    this.prevent = true;
    this.onMarkerDoubleClick(this.elementRef.nativeElement);
  }

  onMarkerClick(element: any) {
    //this is temporary, will fix later by using new component
    let stationName = (this.elementRef.nativeElement.childNodes[1].innerText);

    fetch('https://www.aviationweather.gov/adds/dataserver_current/httpparam?dataSource=metars&requestType=retrieve&format=xml&stationString=' + stationName + '&hoursBeforeNow=2')
      .then(data => data.text())
      .then(data => {
        let parser = new DOMParser();
        let xml = parser.parseFromString(data, 'text/xml');
        this.jsonResult = this.xmlJson.xmlToJson(xml);
        let firstResult = this.jsonResult.response.data.METAR[0];

        this.returnedJSON = {
          lat: parseFloat(element.getAttribute('data-lat')),
          long: parseFloat(element.getAttribute('data-long')),
          airportCode: element.getAttribute('data-airportCode'),
          airportName: element.getAttribute('data-airportName'),
          observationTime: new Date(firstResult.observation_time) + "",
          altimeterSetting: parseFloat(firstResult.altim_in_hg),
          dewPoint: parseFloat(firstResult.dewpoint_c),
          temperature: parseFloat(firstResult.temp_c),
          windSpeedKt: parseFloat(firstResult.wind_speed_kt),
          visibilityStatueMiles: parseFloat(firstResult.visibility_statute_mi),
          windDegree: parseFloat(firstResult.wind_dir_degrees),
          skyCondition: (Array.isArray(firstResult.sky_condition) == true)? firstResult.sky_condition.map((item: any) => item["@attributes"]) : [firstResult.sky_condition["@attributes"]],
          flightCategory: firstResult.flight_category
        }

        this.mapMarkerService.onClickEvent(this.returnedJSON);
      })
  }

  onMarkerDoubleClick(element: any) {
    this.returnDbClick = {
      lat: parseFloat(element.getAttribute('data-lat')),
      long: parseFloat(element.getAttribute('data-long')),
      airportCode: element.getAttribute('data-airportCode') + "",
      airportName: element.getAttribute('data-airportName') + ""
    }
    this.mapMarkerService.onClickEvent(this.returnDbClick);
  }
}
