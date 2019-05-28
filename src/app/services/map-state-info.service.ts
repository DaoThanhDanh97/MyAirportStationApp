import { Injectable, EventEmitter } from '@angular/core';
import { StateInfo } from '../models/state-info.model';
import * as stateCenter from '../JSON/state_center.json'

@Injectable({
  providedIn: 'root'
})
export class MapStateInfoService {
  private statesInfo: Array<StateInfo> = [];

  stateEvent = new EventEmitter<Array<StateInfo>>();

  constructor() { 
    this.getStatesInfo();
  }

  getStatesInfo() {
    stateCenter.default.map((item: any) => {
      this.statesInfo.push(new StateInfo(item.latitude, item.longitude, item.name, item.state));
    })
    
    this.stateEvent.emit(this.statesInfo.slice());
  }
}
