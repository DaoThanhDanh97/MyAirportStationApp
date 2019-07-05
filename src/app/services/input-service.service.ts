import { Injectable, EventEmitter } from '@angular/core';
import { MapMetarStationsService } from './map-metar-stations.service';

@Injectable({
  providedIn: 'root'
})
export class InputServiceService {
  closeTriggerEvent = new EventEmitter<{trigger: number, src: string}>();

  trigger: number = 0;

  constructor(private mapMetarStationsService: MapMetarStationsService) { }

  onElementBlur() {
    console.log('Element Blurred');
  }

  onInputChange(value: string) {
    console.log(value);
  }

  onCloseTrigger(src: string) {
    this.closeTriggerEvent.emit({
      trigger: this.trigger,
      src: src
    })

    this.trigger = (this.trigger + 1) % 2;
  }
}
