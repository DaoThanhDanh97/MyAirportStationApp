import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-map-view-flight-airsigmet-detail',
  templateUrl: './map-view-flight-airsigmet-detail.component.html',
  styleUrls: ['./map-view-flight-airsigmet-detail.component.css']
})
export class MapViewFlightAirsigmetDetailComponent implements OnInit {
  @Input() rectColor: string;
  @Input() airSigmetType: string;
  @Input() isBottom: boolean;

  constructor() { }

  ngOnInit() {
  }

}
