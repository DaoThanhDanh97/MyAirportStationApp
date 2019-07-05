import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MapMetarStationsService } from 'src/app/services/map-metar-stations.service';
import { InputServiceService } from 'src/app/services/input-service.service';
import { MapResetService } from 'src/app/services/map-reset.service';

@Component({
  selector: 'app-map-view-route-form-input',
  templateUrl: './map-view-route-form-input.component.html',
  styleUrls: ['./map-view-route-form-input.component.css']
})
export class MapViewRouteFormInputComponent implements OnInit {
  @Input() innerTitleLabel: string;
  @Input() inputType: string;

  inputValue: string;
  stationDivDisplay: string;
  inputDisplay: string;
  resultValue: string;
  stationCode: string;

  @Output() stationSearchUpdate = new EventEmitter<{value: string, src: string}>();

  constructor(private mapMetarStationsService: MapMetarStationsService, 
    private inputService: InputServiceService,
    private mapResetService: MapResetService) {
  }

  ngOnInit() {
    this.inputValue = '';
    this.inputDisplay = 'block';
    this.stationDivDisplay = 'none';
    this.resultValue = '';
    this.stationCode = '';
  }

  onInput() {
    //this.mapMetarStationsService.onInputChange(this.inputValue, this.inputType);
    this.stationSearchUpdate.emit({
      value: this.inputValue,
      src: this.inputType
    })
  }

  onResetClick() {
    this.inputValue = '';
    this.inputDisplay = 'block';
    this.stationDivDisplay = 'none';
    this.resultValue = '';
    this.stationCode = '';
    this.mapResetService.onMapResetTrigger();
  }

  onReceivedUpdate(value: any) {
    //console.log(value);
    this.stationDivDisplay = 'block';
    this.inputDisplay = 'none';
    this.inputValue = value.airportName + " (" + value.airportCode + ")";
    this.resultValue = this.inputValue;
    this.stationCode = value.airportCode;
  }
}
