import { Component, OnInit, Input } from '@angular/core';
import { NgxXml2jsonService } from 'ngx-xml2json';
import { MapMarkerService } from 'src/app/services/map-marker.service';

@Component({
  selector: 'app-map-view-marker',
  templateUrl: './map-view-marker.component.html',
  styleUrls: ['./map-view-marker.component.css']
})
export class MapViewMarkerComponent implements OnInit {
  @Input() latitude: number;
  @Input() longitude: number;
  @Input() airportCode: string = "";
  @Input() airportName: string = "";

  markerDisplayValue: string = "flex";
  infoDisplayValue: string = "none";

  isDataLoaded: boolean;
  flightCategoryColor: string = 'black';
  stationLabelTop: string = '0px';

  svgIconSource: string = "";

  jsonResult: any;

  isOpen: boolean;

  temperatureValue: number = 0;
  windDegreeValue: number = 0;
  windSpeedValue: string = "";
  visibilityValue: string = "";
  altimeterValue: number = 0;
  dewPointValue: number = 0;
  cloudCoverValue: string = "";
  cloudFtValue: string = "";
  flightCategory: string = "";
  observationValue: string = "";

  transformValue: string = "translate(35px, 35px)";

  constructor(private xmlJson: NgxXml2jsonService, private mapMarkerService: MapMarkerService) {
    this.isOpen = false;
  }

  ngOnInit() {
    this.mapMarkerService.clickEvent.subscribe((data: any) => {
      if(this.airportCode != data.airportCode || this.isOpen == true) {
        //this.isOpen = false;
        this.infoDisplayValue = "none";
        this.markerDisplayValue = "flex";
        return;
      }
      else {
        //this.isOpen = true;
        this.onInitCall();
      }
    })
  }

  onMarkerClick() {
    this.onInitCall();
  }

  onInitCall() {
    fetch('https://www.aviationweather.gov/adds/dataserver_current/httpparam?dataSource=metars&requestType=retrieve&format=xml&stationString=' + this.airportCode + '&hoursBeforeNow=2')
      .then(data => data.text())
      .then(data => {
        let parser = new DOMParser();
        let xml = parser.parseFromString(data, 'text/xml');
        this.jsonResult = this.xmlJson.xmlToJson(xml);

        console.log(this.jsonResult.response.data.METAR);

        if(this.jsonResult.response.data.METAR != null) {
          let firstResult = (Array.isArray(this.jsonResult.response.data.METAR))? this.jsonResult.response.data.METAR[0] : this.jsonResult.response.data.METAR;
          console.log(firstResult);
          this.temperatureValue = parseFloat(firstResult.temp_c);
          this.windDegreeValue = parseInt(firstResult.wind_dir_degrees);
          this.windSpeedValue = firstResult.wind_speed_kt + " kt";
          this.visibilityValue = firstResult.visibility_statute_mi;
          this.altimeterValue = parseFloat(parseFloat(firstResult.altim_in_hg).toFixed(2));
          this.dewPointValue = firstResult.dewpoint_c;
          // firstResult.sky_condition;
          if(Array.isArray(firstResult.sky_condition)) {
            this.cloudCoverValue = firstResult.sky_condition[0]["@attributes"].sky_cover;
            this.cloudFtValue = firstResult.sky_condition[0]["@attributes"].cloud_base_ft_agl;
          }
          else {
            this.cloudCoverValue = firstResult.sky_condition["@attributes"].sky_cover;
            this.cloudFtValue = firstResult.sky_condition["@attributes"].cloud_base_ft_agl;            
          }
          // firstResult.
          this.flightCategory = firstResult.flight_category;
          this.observationValue = this.getObservationStringFromDate(new Date(firstResult.observation_time));
          this.flightCategoryColor = this.setFlightCategoryColor(firstResult.flight_category);
          this.svgIconSource = this.getSourceIcon(this.cloudCoverValue);
          this.transformValue = this.getTransformValue(this.windDegreeValue);
          this.isDataLoaded = true;
          this.infoDisplayValue = "flex";
          this.markerDisplayValue = "none";
        }
        else {
          this.isDataLoaded = false;
        }
      })
  }

  setFlightCategoryColor(category: string) {
    switch(category) {
      case "LIFR": return "magenta";
      case "IFR": return "red";
      case "MVFR": return "blue";
      case "VFR": return "green"
    }
  }

  getSourceIcon(category: string) {
    switch(category) {
      case "CLR": return "cloud_CLR";
      case "FEW": return "cloud_FEW";
      case "SCT": return "cloud_SCT";
      case "BKN": return "cloud_BKN";
      case "OVC": return "cloud_OVC";
      default: return "";
    }
  }

  getObservationStringFromDate(dateValue: Date) {
    let symbolValue = (dateValue.getTimezoneOffset()/60 <= 0)? "+" : "-";
    let hoursValue = (dateValue.getHours() < 10)? ("0" + dateValue.getHours()) : dateValue.getHours();
    let minutesValue = (dateValue.getMinutes() < 10)? ("0" + dateValue.getMinutes()) : dateValue.getMinutes();
    let secondsValue = (dateValue.getSeconds() < 10)? ("0" + dateValue.getSeconds()) : dateValue.getSeconds();
    return hoursValue + ":" + minutesValue + ":" + secondsValue + " GMT"
      + symbolValue + Math.abs(dateValue.getTimezoneOffset()/60);
  }

  getTransformValue(value: number) {
    return "translate(35px, 35px) " + "rotate(" + value + "deg)"
  }
}
