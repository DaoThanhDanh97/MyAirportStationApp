import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { MapOptionButtonComponent } from './map-option-button/map-option-button.component';
import { MapViewSearchBarComponent } from './map-view-search-bar/map-view-search-bar.component';
import { MapOptionSelectService } from 'src/app/services/map-option-select.service';
import { MapOptionAreaFindComponent } from './map-option-area-find/map-option-area-find.component';

@Component({
  selector: 'app-map-option-menu',
  templateUrl: './map-option-menu.component.html',
  styleUrls: ['./map-option-menu.component.css']
})
export class MapOptionMenuComponent implements OnInit {
  selectedOption: string;

  @ViewChild(MapOptionAreaFindComponent) mapOptionAreaFindComponent: MapOptionAreaFindComponent;

  constructor(private mapOptionSelectService: MapOptionSelectService) {
    this.selectedOption = 'airport_find';
  }

  ngOnInit() {
    this.mapOptionSelectService.mapOptionSelected.subscribe((value: string) => {
      this.selectedOption = value;
    })
  }

  onResetAreaButton() {
    this.mapOptionAreaFindComponent.setResetButtonVisible();
  }
}
