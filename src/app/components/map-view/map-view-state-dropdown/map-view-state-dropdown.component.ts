import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { StateInfo } from 'src/app/models/state-info.model';
import { MapStateInfoService } from '../../../services/map-state-info.service';
import { MapMetarStationsService } from '../../../services/map-metar-stations.service';
import { StateSelectorDirective } from '../../../directives/state-selector.directive';

@Component({
  selector: 'app-map-view-state-dropdown',
  templateUrl: './map-view-state-dropdown.component.html',
  styleUrls: ['./map-view-state-dropdown.component.css']
})
export class MapViewStateDropdownComponent implements OnInit {
  @ViewChild(StateSelectorDirective) stateSelector: StateSelectorDirective;

  statesInfoList: Array<StateInfo> = [];

  stateAirportsList: Array<{airportCode: string, airportName: string}> = [];

  //stateStationList: Array<

  constructor(private mapStateInfoService: MapStateInfoService, private mapMetarStationsService: MapMetarStationsService) { }

  ngOnInit() {
    this.mapStateInfoService.stateEvent.subscribe((data: Array<StateInfo>) => {
      this.statesInfoList = data;
    });

    this.mapStateInfoService.getStatesInfo();

    this.mapMetarStationsService.stationsByStateEvent.subscribe((data: any) => {
      this.stateAirportsList = data;
    })
  }

  onChangeFunction() {
    //this.mapMetarStationsService.onStateChange(this.stateSelector.nativeElement.value);
  }

  resetView() {
    this.stateSelector.onResetClick();    
  }
}
