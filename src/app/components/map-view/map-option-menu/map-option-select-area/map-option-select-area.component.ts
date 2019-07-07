import { Component, OnInit, Input, QueryList, ViewChildren, AfterViewInit } from '@angular/core';
import { MapOptionSelectItemComponent } from './map-option-select-item/map-option-select-item.component';
import { MapOptionSelectService } from 'src/app/services/map-option-select.service';

@Component({
  selector: 'app-map-option-select-area',
  templateUrl: './map-option-select-area.component.html',
  styleUrls: ['./map-option-select-area.component.css']
})
export class MapOptionSelectAreaComponent implements OnInit, AfterViewInit {
  @Input() selectedOption: string;
  @ViewChildren(MapOptionSelectItemComponent) mapOptionSelectItems: QueryList<MapOptionSelectItemComponent>;

  constructor(private mapOptionSelectService: MapOptionSelectService) { }

  ngOnInit() {
    this.mapOptionSelectService.mapOptionSelected.subscribe((value: string) => {
      this.selectedOption = value;
      this.forEachComponentCall();
    })
  }

  ngAfterViewInit() {
    // console.log(this.mapOptionSelectItems.toArray());
    this.forEachComponentCall();
  }

  forEachComponentCall() {
    this.mapOptionSelectItems.toArray().forEach(component => {
      component.checkSelected(this.selectedOption);
    })
  }
}
