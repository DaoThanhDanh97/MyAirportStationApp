import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-map-search-result-marker',
  templateUrl: './map-search-result-marker.component.html',
  styleUrls: ['./map-search-result-marker.component.css']
})
export class MapSearchResultMarkerComponent implements OnInit {
  @Input() searchResult: any;

  constructor() { }

  ngOnInit() {
  }

  
}
