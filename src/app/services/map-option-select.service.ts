import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MapOptionSelectService {
  mapOptionSelected = new EventEmitter<string>();

  constructor() { }

  onMapOptionSelectedEvent(value: string) {
    this.mapOptionSelected.emit(value);
  }
}
