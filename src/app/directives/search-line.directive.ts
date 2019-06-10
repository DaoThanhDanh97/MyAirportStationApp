import { Directive, HostBinding, ElementRef, Renderer2, HostListener, Input } from '@angular/core';
import { MapMetarStationsService } from '../services/map-metar-stations.service';
import { InputServiceService } from '../services/input-service.service';

@Directive({
  selector: '[appSearchLine]'
})
export class SearchLineDirective {
  constructor(private elementRef: ElementRef, private inputService: InputServiceService) {

  }

  @HostListener('document:click', ['$event']) onClick(event: any) {
    console.log(this.elementRef.nativeElement.getAttribute('data-id'));

    if(this.elementRef.nativeElement.contains(event.target) == false) {
      this.inputService.onCloseTrigger(this.elementRef.nativeElement.getAttribute('data-id'))
    }
  }
}
