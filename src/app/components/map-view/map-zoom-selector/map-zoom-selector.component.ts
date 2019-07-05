import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { MapMetarStationsService } from 'src/app/services/map-metar-stations.service';

@Component({
  selector: 'app-map-zoom-selector',
  templateUrl: './map-zoom-selector.component.html',
  styleUrls: ['./map-zoom-selector.component.css']
})
export class MapZoomSelectorComponent implements OnInit {
  displayTrigger: string;

  @Output() zoomMapEvent = new EventEmitter<number>();

  constructor(private mapMetarStationsService: MapMetarStationsService) { 
    this.displayTrigger = 'none';
  }

  ngOnInit() {
  }

  setZoomLevel(value: number) {
    //console.log(value);
    //this.mapMetarStationsService.setClickTrigger(false);

    this.zoomMapEvent.emit(value);
  }
}
