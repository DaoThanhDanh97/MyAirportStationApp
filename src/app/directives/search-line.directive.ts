import { Directive, HostBinding, ElementRef, Renderer2, HostListener, Input } from '@angular/core';
import { MapMetarStationsService } from '../services/map-metar-stations.service';
import { InputServiceService } from '../services/input-service.service';

@Directive({
  selector: '[appSearchLine]'
})
export class SearchLineDirective {
  constructor(private elementRef: ElementRef, private inputService: InputServiceService, private mapMetarStationsService: MapMetarStationsService) {

  }

  @HostListener('document:click', ['$event']) onClick(event: any) {
    if(this.elementRef.nativeElement.contains(event.target) == false) {
      this.inputService.onCloseTrigger(this.elementRef.nativeElement.getAttribute('data-id'))
    }
  }

  @HostListener('focus', ['$event']) onFocusClick(event: any) {
    this.mapMetarStationsService.onInputChange(this.elementRef.nativeElement.value, this.elementRef.nativeElement.getAttribute('data-id'));
  }

  @HostListener('input', ['$event']) oninput(event: any) {
    this.mapMetarStationsService.onInputChange(this.elementRef.nativeElement.value, this.elementRef.nativeElement.getAttribute('data-id'));
  }

  clickFocus() {
    setTimeout(() => this.elementRef.nativeElement.focus(), 0);
  }
}
