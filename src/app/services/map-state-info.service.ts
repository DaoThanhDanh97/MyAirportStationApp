import { Injectable, EventEmitter } from '@angular/core';
import { StateInfo } from '../models/state-info.model';
import * as stateCenter from '../JSON/state_center.json'
import { MapMetarStationsService } from './map-metar-stations.service';

@Injectable({
  providedIn: 'root'
})
export class MapStateInfoService {
  private statesInfo: Array<StateInfo> = [];

  stateEvent = new EventEmitter<Array<StateInfo>>();

  stateData = new EventEmitter<StateInfo>();

  constructor(private mapMetarStationsService: MapMetarStationsService) {
  }

  getStatesInfo() {
    stateCenter.default.map((item: any) => {
      this.statesInfo.push(new StateInfo(item.latitude, item.longitude, item.name, item.state));
    })
    
    this.stateEvent.emit(this.statesInfo.slice());
  }

  getStateToChange(state: string) {
    this.stateData.emit(this.statesInfo.find((item: any) => item.state === state));
    this.mapMetarStationsService.getStateToChange(state);
  }
}
