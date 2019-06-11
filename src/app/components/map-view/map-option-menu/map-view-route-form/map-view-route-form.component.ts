import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-map-view-route-form',
  templateUrl: './map-view-route-form.component.html',
  styleUrls: ['./map-view-route-form.component.css']
})
export class MapViewRouteFormComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  onPointSelected(event: any) {
    console.log(event);
  }
}
