import { Injectable, EventEmitter } from '@angular/core';
import { LatLngLiteral } from '@agm/core';
import * as mapBoundaryData from "../JSON/map_bound.json"

@Injectable({
  providedIn: 'root'
})
export class MapStateBoundaryService {
  private boundaryData: Array<Array<LatLngLiteral>> = [];

  mapData = new EventEmitter<Array<Array<LatLngLiteral>>>();

  constructor() {
  }

  getBoundaryData() {
    mapBoundaryData.default.us48_boundary.map(item => {
      this.boundaryData.push(item.boundary);
    });

    this.mapData.emit(this.boundaryData.slice());
  }
}
