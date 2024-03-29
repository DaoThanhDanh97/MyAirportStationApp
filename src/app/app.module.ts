
import { BrowserModule, DomSanitizer } from '@angular/platform-browser';
import { NgModule, Component } from '@angular/core';
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
import { MapViewRouteFormComponent } from './components/map-view/map-option-menu/map-view-route-form/map-view-route-form.component';
import { MapViewRouteFormInputComponent } from './components/map-view/map-option-menu/map-view-route-form/map-view-route-form-input/map-view-route-form-input.component';
import { HttpClientModule } from '@angular/common/http';
import { MapOptionAreaFindComponent } from './components/map-view/map-option-menu/map-option-area-find/map-option-area-find.component';
import { AgmJsMarkerClustererModule } from '@agm/js-marker-clusterer';
import { MapFlightMarkerComponent } from './components/map-view/map-flight-marker/map-flight-marker.component';
import { MapFlightDaMarkerComponent } from './components/map-view/map-flight-da-marker/map-flight-da-marker.component';
import { ModalComponent } from './components/map-view/modal-component/modal-component.component';
import { AppDataModalComponent } from './components/app-data-modal/app-data-modal.component';
import { TemperatureChartComponent } from './components/app-data-modal/temperature-chart/temperature-chart.component';
import { AltimeterChartComponent } from './components/app-data-modal/altimeter-chart/altimeter-chart.component';
import { DewpointChartComponent } from './components/app-data-modal/dewpoint-chart/dewpoint-chart.component';
import { MapOptionSelectAreaComponent } from './components/map-view/map-option-menu/map-option-select-area/map-option-select-area.component';
import { MapOptionSelectItemComponent } from './components/map-view/map-option-menu/map-option-select-area/map-option-select-item/map-option-select-item.component';
import { MapStationMetarDetailComponent } from './components/map-view/map-station-metar-detail/map-station-metar-detail.component';
import { OptionMenuDirective } from './directives/option-menu.directive';
import { MapStationDetailAreaComponent } from './components/map-view/map-station-metar-detail/map-station-detail-area/map-station-detail-area.component';
import { Metar24hWindDegreeDirective } from './directives/metar-24h-wind-degree.directive';
import { MapSearchResultMarkerComponent } from './components/map-view/map-search-result-marker/map-search-result-marker.component';
import { MapViewFlightAirsigmetInfoComponent } from './components/map-view/map-view-flight-airsigmet-info/map-view-flight-airsigmet-info.component';
import { MapViewFlightAirsigmetDetailComponent } from './components/map-view/map-view-flight-airsigmet-info/map-view-flight-airsigmet-detail/map-view-flight-airsigmet-detail.component';


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
    MapViewRouteFormComponent,
    MapViewRouteFormInputComponent,
    MapOptionAreaFindComponent,
    MapFlightMarkerComponent,
    MapFlightDaMarkerComponent,
    ModalComponent,
    AppDataModalComponent,
    TemperatureChartComponent,
    AltimeterChartComponent,
    DewpointChartComponent,
    MapOptionSelectAreaComponent,
    MapOptionSelectItemComponent,
    MapStationMetarDetailComponent,
    OptionMenuDirective,
    MapStationDetailAreaComponent,
    Metar24hWindDegreeDirective,
    MapSearchResultMarkerComponent,
    MapViewFlightAirsigmetInfoComponent,
    MapViewFlightAirsigmetDetailComponent,
    
  
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
    matIconRegistry.addSvgIcon("temperature_celsius", domSantinizer.bypassSecurityTrustResourceUrl('./assets/temperature-celsius.svg'));
    matIconRegistry.addSvgIcon("wind_value", domSantinizer.bypassSecurityTrustResourceUrl('./assets/wind.svg'));
    matIconRegistry.addSvgIcon("visibility", domSantinizer.bypassSecurityTrustResourceUrl('./assets/visibility.svg'));
    matIconRegistry.addSvgIcon("altimeter", domSantinizer.bypassSecurityTrustResourceUrl('./assets/altimeter.svg'));
    matIconRegistry.addSvgIcon("drop", domSantinizer.bypassSecurityTrustResourceUrl('./assets/drop.svg'));
    matIconRegistry.addSvgIcon("cloud_CLR", domSantinizer.bypassSecurityTrustResourceUrl('./assets/cloud_CLR.svg'));
    matIconRegistry.addSvgIcon("cloud_FEW", domSantinizer.bypassSecurityTrustResourceUrl('./assets/cloud_FEW.svg'));
    matIconRegistry.addSvgIcon("cloud_SCT", domSantinizer.bypassSecurityTrustResourceUrl('./assets/cloud_SCT.svg'));
    matIconRegistry.addSvgIcon("cloud_BKN", domSantinizer.bypassSecurityTrustResourceUrl('./assets/cloud_BKN.svg'));
    matIconRegistry.addSvgIcon("cloud_OVC", domSantinizer.bypassSecurityTrustResourceUrl('./assets/cloud_OVC.svg'));
    matIconRegistry.addSvgIcon("cloud_DFT", domSantinizer.bypassSecurityTrustResourceUrl('./assets/cloud_DFT.svg'));
    matIconRegistry.addSvgIcon("cloud", domSantinizer.bypassSecurityTrustResourceUrl('./assets/cloud.svg'));
    matIconRegistry.addSvgIcon("wind-dir", domSantinizer.bypassSecurityTrustResourceUrl('./assets/wind-dir.svg'));
    matIconRegistry.addSvgIcon("height", domSantinizer.bypassSecurityTrustResourceUrl('./assets/height.svg'));
    matIconRegistry.addSvgIcon("slp", domSantinizer.bypassSecurityTrustResourceUrl('./assets/slp.svg'));
  }
}
