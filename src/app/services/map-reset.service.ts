import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MapResetService {
  mapResetEvent = new EventEmitter<void>();

  constructor() { }

  onMapResetTrigger() {
    this.mapResetEvent.emit();
  }
}
