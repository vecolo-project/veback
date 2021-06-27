import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BikeManufacturer } from 'src/app/shared/models';

@Component({
  selector: 'app-bikes-manufacturer-list',
  templateUrl: './bikes-manufacturer-list.component.html',
  styleUrls: ['./bikes-manufacturer-list.component.scss'],
})
export class BikesManufacturerListComponent implements OnInit {
  @Input()
  manufacturers: BikeManufacturer[];

  @Input()
  manufacturersCount: number;

  @Input()
  loading: boolean;

  @Output()
  getManufacturers = new EventEmitter();

  @Output()
  deleteManufacturer = new EventEmitter<number>();

  @Output()
  setEditManufacturer = new EventEmitter<number>();

  displayedColumns = ['id', 'name', 'phone', 'address', 'actions'];
  constructor() {}

  ngOnInit(): void {
    setTimeout(() => {
      this.getManufacturers.emit();
    });
  }
}
