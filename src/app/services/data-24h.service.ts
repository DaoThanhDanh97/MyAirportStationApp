import { Injectable } from '@angular/core';

import * as _ from 'lodash'

@Injectable({
  providedIn: 'root'
})
export class Data24hService {
  private data: any;
  // private newdata: any;
  private typefilters = ["METAR"];
  public saveData(value: any){
    this.data = value;   
  }
  
  getAltimeter(){
    return (_.map(this.data, function(item) {
      return _.pick(item, "observation_time","altim_in_hg");
    }))
  }

  getDewPoint(){
    return (_.map(this.data, function(item) {
      return _.pick(item, "observation_time","dewpoint_c");
    }))
  }

  getTemperature(){
    return (_.map(this.data, function(item) {
      return _.pick(item, "observation_time","temp_c");
    }))
  }

  getWind(){
    return (_.map(this.data, function(item) {
      return _.pick(item, "observation_time","wind_dir_degrees","wind_speed_kt");
    }))
  }

  getVisibility(){
    return (_.map(this.data, function(item) {
      return _.pick(item, "observation_time","visibility_statute_mi");
    }))
  }
}
