import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-map-flight-da-marker',
  templateUrl: './map-flight-da-marker.component.html',
  styleUrls: ['./map-flight-da-marker.component.css']
})
export class MapFlightDaMarkerComponent implements OnInit {
  @Input() latitude: number;
  @Input() longitude: number;
  @Input() airportCode: string = "";
  @Input() airportName: string = "";
  @Input() markerColor: string;

  constructor() { }

  ngOnInit() {
  }

}
