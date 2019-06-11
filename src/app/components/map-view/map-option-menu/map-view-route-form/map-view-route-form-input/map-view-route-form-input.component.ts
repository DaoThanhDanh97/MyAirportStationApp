import { Component, OnInit, Input } from '@angular/core';
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
  displayValue: string;
  stationDivDisplay: string;
  resultValue: string;
  inputDisplay: string;

  result: Array<{airportName: string, airportCode: string}> = [];

  constructor(private mapMetarStationsService: MapMetarStationsService, 
    private inputService: InputServiceService,
    private mapResetService: MapResetService) {
  }

  ngOnInit() {
    this.inputValue = '';
    this.inputDisplay = 'block';
    this.displayValue = 'none';
    this.stationDivDisplay = 'none';
    this.resultValue = '';

    this.mapMetarStationsService.stationsByInputEvent.subscribe((data: any) => {
      this.result = (data.inputSource == this.inputType)? data.result : [];
      this.displayValue = (this.result.length > 0)? 'block' : 'none';
    })

    this.inputService.closeTriggerEvent.subscribe((data: any) => {
      //console.log(data);
      if(data.src == this.inputType) {
        this.result = [];
        this.displayValue = 'none';
      }
    })
  }

  onInput() {
    this.mapMetarStationsService.onInputChange(this.inputValue, this.inputType);
  }

  onRouteFormStationSelected(value: any) {
    this.mapMetarStationsService.getMoveDestination(value.getAttribute('data-airportCode'));
    this.inputValue = value.getAttribute('data-airportName') + " (" + value.getAttribute('data-airportCode') + ")";
    this.resultValue = this.inputValue;
    this.result = [];
    this.displayValue = 'none';
    this.inputDisplay = 'none';
    this.stationDivDisplay = 'block';
  }

  onResetClick() {
    this.inputValue = '';
    this.inputDisplay = 'block';
    this.displayValue = 'none';
    this.stationDivDisplay = 'none';
    this.resultValue = '';
    this.mapResetService.onMapResetTrigger();
  }
}
