import {Component, EventEmitter, Inject, Input, OnInit, Output} from '@angular/core';
import {Bike, OsmSearchResponse, Ride, Station, StationMonitoring} from '../../../../shared/models';
import {interval, Subscription, timer} from 'rxjs';
import {AnimationOptions} from 'ngx-lottie';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {ConfirmDialogComponent} from '../../../../shared/confirm-dialog/confirm-dialog.component';
import {RouterNavigation} from '../../../../core/router/router.navigation';
import {endOfDay, startOfDay, subDays} from 'date-fns';

@Component({
  selector: 'app-stations-view',
  templateUrl: './stations-view.component.html',
  styleUrls: ['./stations-view.component.scss']
})
export class StationsViewComponent implements OnInit {
  @Input()
  station: Station;

  @Input()
  token: string;

  @Output()
  getStation = new EventEmitter<number>();

  @Output()
  deleteStation = new EventEmitter<number>();

  @Output()
  getMonitoring = new EventEmitter<{ stationId: number, start: Date, end: Date }>();

  @Output()
  getToken = new EventEmitter<number>();

  @Input()
  stationMonitorings: StationMonitoring[];

  @Input()
  isAdmin: boolean;

  @Input()
  isStaff: boolean;

  @Output()
  submitStation = new EventEmitter<Station>();

  @Input()
  bikes: Bike[];

  @Input()
  bikeCount: number;

  @Output()
  getBikes = new EventEmitter<{ stationId: number, limit: number, offset: number; }>();

  @Input()
  rides: Ride[];

  @Input()
  rideCount: number;

  @Output()
  getRides = new EventEmitter<{ stationId: number, limit: number, offset: number; }>();

  bikeDisplayedColumns = [
    'matricule',
    'battery',
    'status',
    'model',
  ];

  rideDisplayedColumns = [
    'start',
    'end',
    'duration-length',
    'invoice',
    'matricule',
    'user'
  ];

  editMode: boolean;
  stationForm: FormGroup;

  obs: Subscription;

  lottieRideOptions: AnimationOptions = {
    path: 'assets/lottie/solarPanel2.json',
  };

  dateRange: FormGroup;

  constructor(@Inject(FormBuilder) fb, private dialog: MatDialog, private routerNavigation: RouterNavigation) {
    this.stationForm = fb.group({
      BATTERY_CAPACITY: ['', [Validators.required, Validators.min(1)]],
      BIKE_CAPACITY: ['', [Validators.required, Validators.min(0)]],
      STREET_NUMBER: ['', [Validators.required]],
      STREET_NAME: ['', [Validators.required]],
      CITY: ['', [Validators.required]],
      ZIPCODE: ['', [Validators.required]],
      COORDINATE_Y: ['', [Validators.required]],
      COORDINATE_X: ['', [Validators.required]]
    });
    const today = new Date();

    this.dateRange = fb.group({
      start: [subDays(today, 3), Validators.required],
      end: [today, Validators.required]
    });
  }

  ngOnInit(): void {
    this.obs = interval(5000)
      .subscribe(() => {
        if (!this.editMode && this.station) {
          this.getStation.emit(this.station?.id);
        }
      });
    const today = new Date();
    this.dateRange.controls.start.patchValue(subDays(today, 3));
    this.dateRange.controls.end.patchValue(today);
    timer(500)
      .subscribe(() => {
        this.retrieveMonitoring();
        this.onGetBikes(10, 0);
        this.onGetRides(10, 0);
      });
    this.editMode = false;
  }

  getLastMonitoring(): StationMonitoring {
    if (this.station?.stationMonitoring?.length > 0) {
      return this.station.stationMonitoring[0];
    }
    return undefined;
  }

  onGetBikes(limit: number, offset: number): void {
    if (this.station) {
      this.getBikes.emit({stationId: this.station?.id, limit, offset});
    }
  }

  onViewBike(bike: Bike): void {
    this.routerNavigation.gotoBikeView(bike.id);
  }

  onGetRides(limit: number, offset: number): void {
    if (this.station && this.isStaff) {
      this.getRides.emit({stationId: this.station?.id, limit, offset});
    }
  }

  onViewRideBike(ride: Ride): void {
    if (this.isStaff) {
      this.routerNavigation.gotoRideView(ride.id);
    }
  }

  retrieveMonitoring(): void {
    if (this.station && this.dateRange.valid) {
      this.getMonitoring.emit({
        stationId: this.station?.id,
        start: startOfDay(this.dateRange.value.start),
        end: endOfDay(this.dateRange.value.end)
      });
    }
  }

  getProgressColorClass(): string {
    if (this.getLastMonitoring()?.batteryPercent < 15) {
      return 'battery-low';
    }
    if (this.getLastMonitoring()?.batteryPercent < 33) {
      return 'battery-warn';
    }
    if (this.getLastMonitoring()?.batteryPercent < 75) {
      return 'battery-good';
    }
    return 'battery-great';
  }

  onEdit(): void {
    this.stationForm.controls.BATTERY_CAPACITY.patchValue(this.station.batteryCapacity);
    this.stationForm.controls.BIKE_CAPACITY.patchValue(this.station.bikeCapacity);
    this.stationForm.controls.STREET_NUMBER.patchValue(this.station.streetNumber);
    this.stationForm.controls.STREET_NAME.patchValue(this.station.streetName);
    this.stationForm.controls.CITY.patchValue(this.station.city);
    this.stationForm.controls.ZIPCODE.patchValue(this.station.zipcode);
    this.stationForm.controls.COORDINATE_Y.patchValue(this.station.coordinateY);
    this.stationForm.controls.COORDINATE_X.patchValue(this.station.coordinateX);
    this.editMode = true;
  }

  onSubmit(): void {
    const station: Station = {
      id: this.station.id,
      batteryCapacity: this.stationForm.value.BATTERY_CAPACITY,
      bikeCapacity: this.stationForm.value.BIKE_CAPACITY,
      streetNumber: this.stationForm.value.STREET_NUMBER,
      streetName: this.stationForm.value.STREET_NAME,
      city: this.stationForm.value.CITY,
      zipcode: this.stationForm.value.ZIPCODE,
      coordinateX: this.stationForm.value.COORDINATE_X,
      coordinateY: this.stationForm.value.COORDINATE_Y
    };
    this.submitStation.emit(station);
    this.editMode = false;
  }

  onAddressInputSearch(): void {
    console.log('search');
    this.stationForm.controls.STREET_NUMBER.patchValue(null);
    this.stationForm.controls.STREET_NAME.patchValue(null);
    this.stationForm.controls.CITY.patchValue(null);
    this.stationForm.controls.ZIPCODE.patchValue(null);
    this.stationForm.controls.COORDINATE_Y.patchValue(null);
    this.stationForm.controls.COORDINATE_X.patchValue(null);
  }

  onSelectAdress(address: OsmSearchResponse): void {
    this.stationForm.controls.STREET_NUMBER.patchValue(address.address.house_number || 0);
    this.stationForm.controls.STREET_NAME.patchValue(address.address.road);
    this.stationForm.controls.CITY.patchValue(address.address.city || address.address.town);
    this.stationForm.controls.ZIPCODE.patchValue(address.address.postcode);
    this.stationForm.controls.COORDINATE_Y.patchValue(address.lat);
    this.stationForm.controls.COORDINATE_X.patchValue(address.lon);
  }

  onDelete(): void {
    const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Suppression d\'une station',
        message: 'Êtes vous sûr de vouloir supprimer cette station ?'
      }
    });
    confirmDialog.afterClosed().subscribe(result => {
      if (result === true) {
        this.obs.unsubscribe();
        this.deleteStation.emit(this.station.id);
      }
    });
  }
}
