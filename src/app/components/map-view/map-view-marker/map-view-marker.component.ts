import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-map-view-marker',
  templateUrl: './map-view-marker.component.html',
  styleUrls: ['./map-view-marker.component.css']
})
export class MapViewMarkerComponent implements OnInit {
  @Input() latitude: number;
  @Input() longitude: number;
  @Input() airportCode: string = "";
  @Input() airportName: string = "";

  constructor() { }

  ngOnInit() {
    
  }

  onMarkerClick() {
    console.log('Hello');
  }
}
