import { Directive, ElementRef, Renderer2, HostListener } from '@angular/core';
import { NgxXml2jsonService } from 'ngx-xml2json';

//var parser = require('xml2json');

@Directive({
  selector: '[appStationMarker]'
})
export class StationMarkerDirective {
  jsonResult: any;

  returnedJSON = {
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

  constructor(private elementRef: ElementRef, private renderer: Renderer2, private xmlJson: NgxXml2jsonService) { }

  @HostListener('click', ['$event']) async onMarkerClick(event: any) {
    //this is temporary, will fix later by using new component
    let stationName = (this.elementRef.nativeElement.childNodes[1].innerText);

    let test = await fetch('https://www.aviationweather.gov/adds/dataserver_current/httpparam?dataSource=metars&requestType=retrieve&format=xml&stationString=' + stationName + '&hoursBeforeNow=2');

    let res = await test.text();

    let parser = new DOMParser();

    let xml = parser.parseFromString(res, 'text/xml');

    this.jsonResult = this.xmlJson.xmlToJson(xml);

    let firstResult = this.jsonResult.response.data.METAR[0];

    console.log(firstResult);

    this.returnedJSON.observationTime = new Date(firstResult.observation_time) + "";
    this.returnedJSON.altimeterSetting = parseFloat(firstResult.altim_in_hg);
    this.returnedJSON.dewPoint = parseFloat(firstResult.dewpoint_c);
    this.returnedJSON.temperature = parseFloat(firstResult.temp_c);
    this.returnedJSON.windSpeedKt = parseFloat(firstResult.wind_speed_kt);
    this.returnedJSON.visibilityStatueMiles = parseFloat(firstResult.visibility_statute_mi);
    this.returnedJSON.windDegree = parseFloat(firstResult.wind_dir_degrees);
    this.returnedJSON.skyCondition = (Array.isArray(firstResult.sky_condition) == true)? firstResult.sky_condition.map((item: any) => item["@attributes"]) : [firstResult.sky_condition["@attributes"]];
    this.returnedJSON.flightCategory = firstResult.flight_category;

    alert(
      "Observation Time: " + this.returnedJSON.observationTime + "\n" +
      "Pressure Altitude: " + this.returnedJSON.altimeterSetting + "\n" +
      "Dewpoint (Celsius): " + this.returnedJSON.dewPoint + "\n" +
      "Temperature (Celsius): " + this.returnedJSON.temperature + "\n" +
      "Wind Speed (knot): " + this.returnedJSON.windSpeedKt + "\n" +
      "Wind Direction (degree): " + this.returnedJSON.windDegree + "\n" +
      "Sky Condition: " + this.returnedJSON.skyCondition.map((item: any) => JSON.stringify(item)).join(",") + "\n" +
      "Flight Category: " + this.returnedJSON.flightCategory
    )
  }
}
