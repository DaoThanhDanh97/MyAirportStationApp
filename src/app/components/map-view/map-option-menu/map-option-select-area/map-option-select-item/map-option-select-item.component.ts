import { Component, OnInit, Input } from '@angular/core';
import { MapOptionSelectService } from 'src/app/services/map-option-select.service';

@Component({
  selector: 'app-map-option-select-item',
  templateUrl: './map-option-select-item.component.html',
  styleUrls: ['./map-option-select-item.component.css']
})
export class MapOptionSelectItemComponent implements OnInit {
  @Input() optionName: string;
  @Input() optionValue: string;
  selectionResult: string = 'selection-item';

  constructor(private mapOptionSelectService: MapOptionSelectService) { }

  ngOnInit() {
  }

  checkSelected(selectedOption: string) {
    this.selectionResult = (this.optionValue == selectedOption)? 'selected-item' : 'selection-item';
  }

  onSelectionClick() {
    if(this.selectionResult == 'selection-item') {
      this.mapOptionSelectService.mapOptionSelected.emit(this.optionValue);
    }
  }
}
