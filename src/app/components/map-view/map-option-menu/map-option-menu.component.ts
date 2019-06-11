import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { MapOptionButtonComponent } from './map-option-button/map-option-button.component';
import { MapViewSearchBarComponent } from './map-view-search-bar/map-view-search-bar.component';

@Component({
  selector: 'app-map-option-menu',
  templateUrl: './map-option-menu.component.html',
  styleUrls: ['./map-option-menu.component.css']
})
export class MapOptionMenuComponent implements OnInit {
  selectedOption: string = "";

  @ViewChild('mapOptionAirport') mapOptionAirport: MapOptionButtonComponent;
  @ViewChild('mapOptionRoute') mapOptionRoute: MapOptionButtonComponent;
  @ViewChild('mapOptionArea') mapOptionArea: MapOptionButtonComponent;
  @ViewChild('mapViewSearchBar') mapViewSearchBar: MapViewSearchBarComponent;

  @Output() changeModeEvent = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {
  }

  changeSelectMode(event: string) {
    this.selectedOption = event;

    this.mapOptionAirport.onOutsideDisplayValueTrigger(false);
    this.mapOptionRoute.onOutsideDisplayValueTrigger(false);
    this.mapOptionArea.onOutsideDisplayValueTrigger(false);

    if(event == this.mapOptionAirport.displayMode) {
      this.mapOptionAirport.onOutsideDisplayValueTrigger(true);
    }
    else if (event == this.mapOptionRoute.displayMode) {
      this.mapOptionRoute.onOutsideDisplayValueTrigger(true);
    }
    else if (event == this.mapOptionArea.displayMode) {
      this.mapOptionArea.onOutsideDisplayValueTrigger(true);
    }

    this.changeModeEvent.emit(event);
  }

  airportModeClickTriggerEvent(data: any) {
    this.mapViewSearchBar.airportModeClickTriggerEvent(data);
  }
}
