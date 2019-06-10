import { Component, OnInit, ViewChildren, QueryList, AfterViewInit, ViewChild, EventEmitter, Output } from '@angular/core';
import { MapMetarStationsService } from 'src/app/services/map-metar-stations.service';
import { SearchLineDirective } from 'src/app/directives/search-line.directive';
import { MapViewInputComponent } from './map-view-input/map-view-input.component';

@Component({
  selector: 'app-map-view-search-bar',
  templateUrl: './map-view-search-bar.component.html',
  styleUrls: ['./map-view-search-bar.component.css'],

})
export class MapViewSearchBarComponent implements OnInit, AfterViewInit {
  result: Array<{airportName: string, airportCode: string}> = [];

  reportDisable: boolean;

  @ViewChildren(SearchLineDirective) allMyCustomDirective: QueryList<SearchLineDirective>;
  @ViewChild('appMapViewInput') appMapViewInput: MapViewInputComponent;

  @Output() resetEventEmitter = new EventEmitter<void>();

  constructor(private mapMetarStationsService: MapMetarStationsService) {
    this.reportDisable = true;
  }

  ngOnInit() {
    this.mapMetarStationsService.stationsByInputEvent.subscribe((data: any) => {
      this.result = data;
    })
  }

  ngAfterViewInit() {
    console.log(this.allMyCustomDirective);
  }

  onStationSelected(target: any) {
    this.reportDisable = false;
  }

  resetView() {
    this.reportDisable = true;
    this.appMapViewInput.onResetClick();

    this.resetEventEmitter.emit();
  }

  
}
