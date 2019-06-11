import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { SearchResultDirective } from 'src/app/directives/search-result.directive';
import { SearchLineDirective } from 'src/app/directives/search-line.directive';
import { MapMetarStationsService } from 'src/app/services/map-metar-stations.service';
import { InputServiceService } from 'src/app/services/input-service.service';
import { MapResetService } from 'src/app/services/map-reset.service';
import { MapMarkerService } from 'src/app/services/map-marker.service';

@Component({
  selector: 'app-map-view-input',
  templateUrl: './map-view-input.component.html',
  styleUrls: ['./map-view-input.component.css']
})
export class MapViewInputComponent implements OnInit {
  @Input('titleLabel') innerTitleLabel: string; 
  @Input() inputType: string;

  @ViewChild(SearchResultDirective) resultList: SearchResultDirective;
  @ViewChild(SearchLineDirective) searchBar: SearchLineDirective;

  @Output() stationClickEventEmitter = new EventEmitter<void>();

  inputClass: string = 'col-xl-12 form-control border-top-0 border-left-0 border-right-0 rounded-0 no-border-box';
  displayValue: string = 'none';
  resultValue: string = '';

  inputValue: string;
  buttonClass: string;

  stationDivDisplay: string = 'none';
  inputDisplay: string = 'block';

  result: Array<{airportName: string, airportCode: string}> = [];

  constructor(private mapMetarStationsService: MapMetarStationsService, 
    private inputService: InputServiceService,
    private mapResetService: MapResetService,
    private mapMarkerService: MapMarkerService) { 
  }

  ngOnInit() {
    this.buttonClass = (this.inputType === 'startPoint')? 'btn-primary' : 'btn-success';

    this.mapMetarStationsService.stationsByInputEvent.subscribe((data: any) => {
      if(this.inputType === data.inputSource) {
        this.result = data.result;
        this.displayValue = 'block';
      }
      else {
        this.result = [];
        this.displayValue = 'none';
      }
    })

    this.inputService.closeTriggerEvent.subscribe((data: any) => {
      if(data.src === this.inputType) {
        this.result = [];
        this.displayValue = 'none';
        this.inputClass = 'col-xl-12 form-control border-top-0 border-left-0 border-right-0 rounded-0 no-border-box';
      }
    });

    this.mapMarkerService.airportModeEvent.subscribe((data: any) => {
      this.stationDivDisplay = 'block';
      this.inputValue = data.airportName + " (" + data.airportCode + ")";
      this.resultValue = this.inputValue;
      this.inputDisplay = 'none';
      this.stationClickEventEmitter.emit();
    })
  }

  onInputFieldFocus(target: any) {
    let addedClass = (this.inputType == 'startPoint')? ' border-primary' : ' border-success';

    this.inputClass = this.inputClass + addedClass;

    this.displayValue = 'block';
  }

  onInputFieldBlur() {
  }

  onInput() {
    this.mapMetarStationsService.onInputChange(this.inputValue, this.inputType);
  }

  onStationSelected(element: any) {
    this.mapMetarStationsService.getMoveDestination(element.getAttribute('data-airportCode'));

    this.inputValue = element.getAttribute('data-airportName') + " (" + element.getAttribute('data-airportCode') + ")";
  
    this.stationDivDisplay = 'block';
    this.inputDisplay = 'none';

    this.stationClickEventEmitter.emit();

    this.resultValue = this.inputValue;
  }

  onResetClick() {
    this.stationDivDisplay = 'none';
    this.inputValue = '';
    this.inputDisplay = 'block';
    this.mapResetService.onMapResetTrigger();
  }

  airportModeClickTriggerEvent(data: any) {
  }
}
