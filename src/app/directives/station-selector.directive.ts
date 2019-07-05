import { Directive, ElementRef, Renderer2, HostListener } from '@angular/core';
import { MapMetarStationsService } from '../services/map-metar-stations.service'

@Directive({
  selector: '[appStationSelector]'
})
export class StationSelectorDirective {

  constructor(private elementRef: ElementRef, private renderer2: Renderer2, private mapMetarStationsService: MapMetarStationsService) { }

  @HostListener('change', ['$event']) onChangeEvent(event: any) {
    console.log('Changed');

    this.mapMetarStationsService.onStationChange(event.target.value);
  }  
}
