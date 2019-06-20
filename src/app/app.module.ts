import { BrowserModule, DomSanitizer } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'

import { AppComponent } from './app.component';
import { AppHeaderComponent } from './components/app-header/app-header.component';
import { MapViewComponent } from './components/map-view/map-view.component';
import { AgmCoreModule } from '@agm/core';
import { AgmOverlays } from "agm-overlays";
import { MapViewMarkerComponent } from './components/map-view/map-view-marker/map-view-marker.component';
import { StationDetailComponent } from './components/station-detail/station-detail.component';
import { RouterModule, Routes } from '@angular/router';
import { StateSelectorDirective } from './directives/state-selector.directive';
import { StationSelectorDirective } from './directives/station-selector.directive';
import { StationMarkerDirective } from './directives/station-marker.directive';
import { MapViewSpinnerComponent } from './components/map-view/map-view-spinner/map-view-spinner.component';
import { SpinnerLayerDirective } from './directives/spinner-layer.directive';
import { MapViewSearchBarComponent } from './components/map-view/map-option-menu/map-view-search-bar/map-view-search-bar.component';
import { SearchLineDirective } from './directives/search-line.directive';
import { MapMetarStationsService } from './services/map-metar-stations.service';
import { MapViewInputComponent } from './components/map-view/map-option-menu/map-view-search-bar/map-view-input/map-view-input.component';
import { SearchResultDirective } from './directives/search-result.directive';
import { MapZoomSelectorComponent } from './components/map-view/map-zoom-selector/map-zoom-selector.component';
import { GoogleChartsModule } from 'angular-google-charts';
import { MapOptionMenuComponent } from './components/map-view/map-option-menu/map-option-menu.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatButtonModule, MatCheckboxModule, MatIconModule, MatIconRegistry} from '@angular/material';
import { MapOptionButtonComponent } from './components/map-view/map-option-menu/map-option-button/map-option-button.component';
import { MapViewRouteFormComponent } from './components/map-view/map-option-menu/map-view-route-form/map-view-route-form.component';
import { MapViewRouteFormInputComponent } from './components/map-view/map-option-menu/map-view-route-form/map-view-route-form-input/map-view-route-form-input.component';
import { HttpClientModule } from '@angular/common/http';
import { MapOptionAreaFindComponent } from './components/map-view/map-option-menu/map-option-area-find/map-option-area-find.component';
import { AgmJsMarkerClustererModule } from '@agm/js-marker-clusterer';

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
    StationDetailComponent,
    StateSelectorDirective,
    StationSelectorDirective,
    StationMarkerDirective,
    MapViewSpinnerComponent,
    SpinnerLayerDirective,
    MapViewSearchBarComponent,
    SearchLineDirective,
    MapViewInputComponent,
    SearchResultDirective,
    MapZoomSelectorComponent,
    MapOptionMenuComponent,
    MapOptionButtonComponent,
    MapViewRouteFormComponent,
    MapViewRouteFormInputComponent,
    MapOptionAreaFindComponent,
  ],
  imports: [
    BrowserModule,
    AgmOverlays,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAn6Yh_RWK_E-UKs7UJpsAdD3eUTiocaVU' + '&libraries=visualization'
    }),
    RouterModule.forRoot(
      appRoute
    ),
    GoogleChartsModule.forRoot('AIzaSyAn6Yh_RWK_E-UKs7UJpsAdD3eUTiocaVU'),
    FormsModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    HttpClientModule,
    AgmJsMarkerClustererModule
  ],
  providers: [MapMetarStationsService],
  bootstrap: [AppComponent]
})
export class AppModule { 
  constructor(private matIconRegistry: MatIconRegistry, private domSantinizer: DomSanitizer) {
    matIconRegistry.addSvgIcon("report_24", domSantinizer.bypassSecurityTrustResourceUrl('/assets/report_24.svg'));
  }
}
