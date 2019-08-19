import { Injectable, EventEmitter } from '@angular/core';

import * as _ from 'lodash'
import { NgxXml2jsonService } from 'ngx-xml2json';

@Injectable({
  providedIn: 'root'
})
export class Data24hService {
  private data: any;
  metarDetailClickEvent = new EventEmitter<void>();
  closeMetarDetailEvent = new EventEmitter<void>();
  passMetarDetailEvent = new EventEmitter<void>();
  resetDataEvent = new EventEmitter<string>();

  constructor(private xmlJson: NgxXml2jsonService) {}

  jsonResult: any;

  saveData(value: any) {
    this.data = value;
    this.passMetarDetailEvent.emit();
  }

  getAltimeter() {
    return (_.map(this.data, function (item) {
      return _.pick(item, "observation_time", "altim_in_hg");
    }))
  }

  getDewPoint() {
    return (_.map(this.data, function (item) {
      return _.pick(item, "observation_time", "dewpoint_c");
    }))
  }

  getTemperature() {
    return (_.map(this.data, function (item) {
      return _.pick(item, "observation_time", "temp_c");
    }))
  }

  getWind() {
    return (_.map(this.data, function (item) {
      return _.pick(item, "observation_time", "wind_dir_degrees", "wind_speed_kt");
    }))
  }

  getVisibility() {
    return (_.map(this.data, function (item) {
      return _.pick(item, "observation_time", "visibility_statute_mi");
    }))
  }

  getCloudCover() {
    let returnedArray = [];
    (this.data.map((item) => {
      if(Array.isArray(item.sky_condition)) {
        return item.sky_condition.map((subItem) => {
          return {
            observation_time: item.observation_time,
            ...subItem
          }
        })
      }
      else {
        return {
          observaion_time: item.observaion_time,
          ...item.sky_condition
        }
      }
    })).map((subArray) => {
      returnedArray.push(...subArray);
    })
    return (returnedArray);
  }

  fetchMetarData24h(station: string) {
    fetch('https://www.aviationweather.gov/adds/dataserver_current/httpparam?dataSource=metars&requestType=retrieve&format=xml&stationString=' + station + '&hoursBeforeNow=24')
        .then(data => data.text())
        .then(data => {
          let parser = new DOMParser();
          let xml = parser.parseFromString(data, 'text/xml');
          this.jsonResult = this.xmlJson.xmlToJson(xml);

          this.metarDetailClickEvent.emit();
          this.saveData(this.jsonResult.response.data.METAR);
        })
  }

  getAltSLP() {
    return (_.map(this.data, function (item) {
      return _.pick(item, "observation_time", "altim_in_hg", "sea_level_pressure_mb");
    }).filter(item => item.sea_level_pressure_mb != null && item.altim_in_hg != null));
  }
}
