import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AppHeaderComponent } from './components/app-header/app-header.component';
import { MapViewComponent } from './components/map-view/map-view.component';
import { AgmCoreModule } from '@agm/core';
import { AgmOverlays } from "agm-overlays";
import { MapViewMarkerComponent } from './components/map-view/map-view-marker/map-view-marker.component';


@NgModule({
  declarations: [
    AppComponent,
    AppHeaderComponent,
    MapViewComponent,
    MapViewMarkerComponent,
  ],
  imports: [
    BrowserModule,
    AgmOverlays,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAn6Yh_RWK_E-UKs7UJpsAdD3eUTiocaVU' + '&libraries=visualization'
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
