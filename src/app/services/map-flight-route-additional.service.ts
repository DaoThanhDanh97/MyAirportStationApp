import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MapFlightRouteAdditionalService {
  onMapBoundaryUpdate = new EventEmitter<any>();
  resetBoundaryDataEvent = new EventEmitter<void>();
  onFlightDataLoadComplete = new EventEmitter<any>();
  onInitialRouteBoundaryReceived = new EventEmitter<void>();
  returnToDefaultMode = new EventEmitter<string>();
  airSigmetArrayEvent = new EventEmitter<Array<any>>();

  constructor() { }
}
