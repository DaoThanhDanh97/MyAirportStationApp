import { Directive, ElementRef, Renderer2, HostListener } from '@angular/core';
import { MapMetarStationsService } from '../services/map-metar-stations.service'

@Directive({
  selector: '[appStateSelector]'
})
export class StateSelectorDirective {

  constructor(private elementRef: ElementRef, private renderer2: Renderer2, private mapMSS: MapMetarStationsService) { }

  onResetClick() {
    this.renderer2.setProperty(this.elementRef.nativeElement, 'value', '');
    this.mapMSS.onStateChange('');
  }

  @HostListener('change', ['$event']) onChangeEvent(event: any) {
    this.mapMSS.onStateChange(event.target.value);
  }
}
