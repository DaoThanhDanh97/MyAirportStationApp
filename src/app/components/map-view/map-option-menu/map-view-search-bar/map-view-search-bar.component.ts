import { Component, OnInit, ViewChildren, QueryList, AfterViewInit, ViewChild, EventEmitter, Output, ElementRef, OnChanges, SimpleChanges, AfterViewChecked, DoCheck } from '@angular/core';
import { MapMetarStationsService } from 'src/app/services/map-metar-stations.service';
import { SearchLineDirective } from 'src/app/directives/search-line.directive';
import { MapViewInputComponent } from './map-view-input/map-view-input.component';
import { InputServiceService } from 'src/app/services/input-service.service';
import { MapResetService } from 'src/app/services/map-reset.service';
import { MapMarkerService } from 'src/app/services/map-marker.service';
import { MapOptionSelectService } from 'src/app/services/map-option-select.service';

@Component({
  selector: 'app-map-view-search-bar',
  templateUrl: './map-view-search-bar.component.html',
  styleUrls: ['./map-view-search-bar.component.css'],

})
export class MapViewSearchBarComponent implements OnInit {
  result: Array<{airportName: string, airportCode: string}> = [];

  inputValue: string = "";

  resultListDisplay: string; // none or flex
  resultDivDisplay: string; // none or block
  inputDisplay: string; // block or none
  resultValue: string;

  isInited: boolean;

  //code 4 chu de search tren api
  resultAirportCode: string;

  @ViewChild(SearchLineDirective) appMapViewSearchBar: SearchLineDirective;

  constructor(private mapMetarStationsService: MapMetarStationsService, 
    private inputService: InputServiceService,
    private mapResetService: MapResetService,
    private mapMarkerService: MapMarkerService,
    private mapOptionSelectService: MapOptionSelectService
  ) {
    this.resultListDisplay = 'none';
    this.resultDivDisplay = 'none';
    this.inputDisplay = 'block';
    this.resultValue = '';
    this.isInited = false;
  }

  ngOnInit() {
    this.mapMetarStationsService.stationsByInputEvent.subscribe((data: any) => {
      this.onResultChange(data.result);
    })

    this.inputService.closeTriggerEvent.subscribe((data: any) => {
      this.onResultChange([]);
    })

    this.mapMarkerService.airportModeEvent.subscribe((data: any) => {
      this.onItemClick(data);
    })
  }

  onResultChange(data: any) {
    this.result = data;
    this.resultListDisplay = (this.result.length > 0)? 'flex' : 'none';
  }

  onItemClick(data: any) {
    this.mapMetarStationsService.getMoveDestination(data.airportCode);
    this.resultValue = data.airportName + " (" + data.airportCode + ")";
    //update result theo ket qua
    this.resultAirportCode = data.airportCode;
    this.inputDisplay = 'none';
    this.resultDivDisplay = 'block';
    this.onResultChange([]);
  }

  onResultDivClick() {
    this.inputValue = '';
    this.resultValue = '';
    //refresh airportCode
    this.resultAirportCode = '';
    this.inputDisplay = 'block';
    this.resultDivDisplay = 'none';
    this.mapResetService.onMapResetTrigger();
    setTimeout(() => this.appMapViewSearchBar.clickFocus(), 0);
  }

  onModeChange(value: any) {
    this.mapOptionSelectService.onMapOptionSelectedEvent(value);
  }

  on24hClick() {
    //fetch api tu awc voi hoursBeforeNow = 24
    
  }
}
