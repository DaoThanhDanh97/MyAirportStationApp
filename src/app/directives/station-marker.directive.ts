import { Directive, ElementRef, Renderer2, HostListener, EventEmitter } from '@angular/core';
import { NgxXml2jsonService } from 'ngx-xml2json';
import { MapMarkerService } from '../services/map-marker.service';

//var parser = require('xml2json');

@Directive({
  selector: '[appStationMarker]'
})
export class StationMarkerDirective {
  jsonResult: any;

  prevent: boolean = false;

  isDbClicked: boolean = false;
  isClicked: boolean = false;

  timer: any = 0;

  returnDbClick = {
    lat: 0,
    long: 0,
    airportCode: "",
    airportName: "",    
  }

  constructor(private elementRef: ElementRef, 
    private renderer: Renderer2, 
    private xmlJson: NgxXml2jsonService,
    private mapMarkerService: MapMarkerService) { }

  @HostListener('click', ['$event.target']) onSingleClick(event: any) {
    this.timer = setTimeout(() => {
      if (this.prevent == false) {
        //console.log(self);
        this.onMarkerClick(this.elementRef.nativeElement);
      }
      this.prevent = false;
    }, 200);
  }

  @HostListener('dblclick', ['$event.target']) onDoubleClick(event: any) {
    clearTimeout(this.timer);
    this.prevent = true;
    this.onMarkerDoubleClick(this.elementRef.nativeElement);
  }

  onMarkerClick(element: any) {
    //this is temporary, will fix later by using new component
    let returnedJSON = {
      lat: parseFloat(element.getAttribute('data-lat')),
      long: parseFloat(element.getAttribute('data-long')),
      airportCode: element.getAttribute('data-airportCode'),
      airportName: element.getAttribute('data-airportName'), 
    }

    this.mapMarkerService.onClickEvent(returnedJSON);
  }

  onMarkerDoubleClick(element: any) {
    this.returnDbClick = {
      lat: parseFloat(element.getAttribute('data-lat')),
      long: parseFloat(element.getAttribute('data-long')),
      airportCode: element.getAttribute('data-airportCode') + "",
      airportName: element.getAttribute('data-airportName') + ""
    }
    this.mapMarkerService.onDoubleClickEvent(this.returnDbClick);
  }
}
