import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MapResetService {
  mapResetEvent = new EventEmitter<void>();
  areaResetEvent = new EventEmitter<void>();
  dashboardResetEvent = new EventEmitter<void>();
  resetSearchResult = new EventEmitter<void>();

  constructor() { }

  onMapResetTrigger() {
    this.mapResetEvent.emit();
  }

  onAreaResetTrigger() {
    this.areaResetEvent.emit();
    this.mapResetEvent.emit();
  }

  onDashboardResetTrigger() {
    this.dashboardResetEvent.emit();
  }
}
