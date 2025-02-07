import {Component, Input, OnChanges, OnInit, SimpleChanges,} from '@angular/core';
import {icon, latLng, marker, MarkerClusterGroupOptions, tileLayer,} from 'leaflet';
import 'leaflet.markercluster';
import {Station, StationMonitoringStatus} from '../../../../shared/models';
import {routesPath} from '../../../../core/router/router.navigation';
import {StationStatusPipe} from '../../../../shared/pipes/StationStatusPipe';

@Component({
  selector: 'app-stations-map',
  templateUrl: './stations-map.component.html',
  styleUrls: ['./stations-map.component.scss'],
})
export class StationsMapComponent implements OnInit, OnChanges {
  @Input()
  stations: Station[];

  options = {
    layers: [
      tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        minZoom: 11,
        maxZoom: 19,
        attribution: 'Vecolo',
      }),
    ],
    zoom: 12,
    center: latLng(48.858222, 2.343683),
  };

  markerClusterOptions: MarkerClusterGroupOptions = {
    showCoverageOnHover: true,
    removeOutsideVisibleBounds: true,
    maxClusterRadius: 60,
    animate: true,
    animateAddingMarkers: true,
  };

  layers = [];

  constructor(private stationStatusPipe: StationStatusPipe) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.layers = [];
    for (const station of this.stations) {
      this.layers.push(this.markerMaker(station));
    }
  }

  ngOnInit(): void {
  }

  markerMaker(station: Station): any {
    return marker([station.coordinateY, station.coordinateX], {
      icon: icon({
        iconSize: [35, 35],
        iconAnchor: [18, 35],
        iconUrl:
          'assets/images/' +
          (station.stationMonitoring[0]?.status ===
          StationMonitoringStatus.ACTIVE
            ? 'station.png'
            : 'station_off.png'),
        shadowUrl: 'assets/images/marker-shadow.png',
      }),
    }).bindPopup(
      `<a href="${
        '/' + routesPath.stationView + '/' + station.id
      }"><h2>Station ${station.id}</h2></a>
                <li>Adresse : ${station.streetNumber} ${
        station.streetName
      } ${station.city.toUpperCase()} (${station.zipcode})</li>
                <li>Vélos disponibles : ${
        station.stationMonitoring[0]?.usedBikeSlot
      }/${station.bikeCapacity}</li>
                <li>Batterie : ${station.stationMonitoring[0]?.batteryPercent.toFixed(
        2
      )}%</li>
                <li>État : ${this.stationStatusPipe.transform(station.stationMonitoring[0]?.status)}</li>
        `
    );
  }
}
