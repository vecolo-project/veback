import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MapComponent} from './containers/map/map.component';
import {MapRoutingModule} from './map-routing.module';
import {LeafletModule} from '@asymmetrik/ngx-leaflet';
import { StationsMapComponent } from './components/stations-map/stations-map.component';


@NgModule({
  declarations: [
    MapComponent,
    StationsMapComponent
  ],
  imports: [
    LeafletModule,
    MapRoutingModule,
    CommonModule
  ]
})
export class MapModule {
}
