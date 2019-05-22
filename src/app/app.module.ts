import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AppHeaderComponent } from './components/app-header/app-header.component';
import { MapViewComponent } from './components/map-view/map-view.component';
import { AgmCoreModule } from '@agm/core';


@NgModule({
  declarations: [
    AppComponent,
    AppHeaderComponent,
    MapViewComponent,
  ],
  imports: [
    BrowserModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAn6Yh_RWK_E-UKs7UJpsAdD3eUTiocaVU' + '&libraries=visualization'
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
