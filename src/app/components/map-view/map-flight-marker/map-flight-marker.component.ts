import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { MapMetarStationsService } from 'src/app/services/map-metar-stations.service';
import { NgxXml2jsonService } from 'ngx-xml2json';
import { MapMarkerService } from 'src/app/services/map-marker.service';

@Component({
  selector: 'app-map-flight-marker',
  templateUrl: './map-flight-marker.component.html',
  styleUrls: ['./map-flight-marker.component.css']
})
export class MapFlightMarkerComponent implements OnInit, AfterViewInit {
  @Input() latitude: number;
  @Input() longitude: number;
  @Input() airportCode: string = "";
  @Input() airportName: string = "";

  @Input() startAirportCode: string;

  @Input() svgIconSource: string;
  @Input() visibilityValue: string = "";
  @Input() windSpeedValue: string = "";
  @Input() transformValue: string;

  jsonResult: any;

  constructor(private xmlJson: NgxXml2jsonService, 
    private mapMetarStationsService: MapMetarStationsService,
    private mapMarkerService: MapMarkerService) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
  }

}
