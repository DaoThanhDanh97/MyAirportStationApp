import { Component, OnInit, Input } from '@angular/core';

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

  constructor() { 
    this.displayValue = 'flex';
    this.displayValueActive = 'none';
  }

  ngOnInit() {
  }

  onDisplayModeSelect(value: string) {
    this.displayValue = (this.displayValue == 'flex')? 'none' : 'flex';
    this.displayValueActive = (this.displayValueActive == 'flex')? 'none' : 'flex';
  }
}
