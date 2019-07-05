import { Component, OnInit } from '@angular/core';
import { MapOptionSelectService } from 'src/app/services/map-option-select.service';
import { MapResetService } from 'src/app/services/map-reset.service';

@Component({
  selector: 'app-map-option-area-find',
  templateUrl: './map-option-area-find.component.html',
  styleUrls: ['./map-option-area-find.component.css']
})
export class MapOptionAreaFindComponent implements OnInit {
  visibilityValue: string = 'hidden';

  constructor(
    private mapOptionSelectService: MapOptionSelectService,
    private mapResetService: MapResetService  
  ) { }

  ngOnInit() {
  }

  onModeChange(value: any) {
    this.mapOptionSelectService.onMapOptionSelectedEvent(value);
  }

  onResetClick() {
    this.visibilityValue = 'hidden';
    this.mapResetService.onAreaResetTrigger();
  }

  setResetButtonVisible() {
    this.visibilityValue = 'visible';
  }
}
