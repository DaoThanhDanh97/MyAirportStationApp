import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AppHeaderComponent } from './components/app-header/app-header.component';
import { MapViewComponent } from './components/map-view/map-view.component';
import { AgmCoreModule } from '@agm/core';
import { AgmOverlays } from "agm-overlays";
import { MapViewMarkerComponent } from './components/map-view/map-view-marker/map-view-marker.component';
import { MapViewStateDropdownComponent } from './components/map-view/map-view-state-dropdown/map-view-state-dropdown.component';
import { StationDetailComponent } from './components/station-detail/station-detail.component';
import { RouterModule, Routes } from '@angular/router';
import { StateSelectorDirective } from './directives/state-selector.directive';

const appRoute: Routes = [
  {
    path: '',
    redirectTo: '/map-view',
    pathMatch: 'full'
  },
  {
    path: 'map-view',
    component: MapViewComponent
  },
  {
    path: 'station-detail',
    component: StationDetailComponent
  }
]

@NgModule({
  declarations: [
    AppComponent,
    AppHeaderComponent,
    MapViewComponent,
    MapViewMarkerComponent,
    MapViewStateDropdownComponent,
    StationDetailComponent,
    StateSelectorDirective,
  ],
  imports: [
    BrowserModule,
    AgmOverlays,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAn6Yh_RWK_E-UKs7UJpsAdD3eUTiocaVU' + '&libraries=visualization'
    }),
    RouterModule.forRoot(
      appRoute
    )
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
