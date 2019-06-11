import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-map-option-button',
  templateUrl: './map-option-button.component.html',
  styleUrls: ['./map-option-button.component.css']
})
export class MapOptionButtonComponent implements OnInit {
  displayValue: string;
  displayValueActive: string;

  @Input() buttonClass: string = "";
  @Input() iconName: string;
  @Input() displayMode: string = "";
  @Input() buttonClassActive: string = "";

  @Output() modeClickEvent = new EventEmitter<string>();

  constructor() { 
    this.displayValue = 'flex';
    this.displayValueActive = 'none';
  }

  ngOnInit() {
  }

  onDisplayModeSelect(value: string) {
    this.displayValue = (this.displayValue == 'flex')? 'none' : 'flex';
    this.displayValueActive = (this.displayValueActive == 'flex')? 'none' : 'flex';
    this.modeClickEvent.emit(value);
  }

  onOutsideDisplayValueTrigger(value: boolean) {
    this.displayValue = (value == true)? 'none' : 'flex';
    this.displayValueActive = (value == false)? 'none' : 'flex';
  }
}
