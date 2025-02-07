import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {StationMonitoring} from '../../../../shared/models';
import {ChartDataSets, ChartOptions, ChartType} from 'chart.js';
import {Color, Label, PluginServiceGlobalRegistrationAndOptions,} from 'ng2-charts';
import {format} from 'date-fns';

@Component({
  selector: 'app-station-battery-chart',
  templateUrl: './station-chart.component.html',
  styleUrls: ['./station-chart.component.scss']
})
export class StationChartComponent implements OnInit, OnChanges {
  @Input()
  stationMonitorings: StationMonitoring[];


  lineChartBatteryData: ChartDataSets[];
  lineChartBatteryLabels: Label[];
  lineChartBikeData: ChartDataSets[];
  lineChartBikeLabels: Label[];
  lineChartBatteryOptions: ChartOptions = {
    responsive: true,
    defaultColor: '#fefefe',
    scales: {
      yAxes: [{
        ticks: {
          fontColor: '#fefefe',
          fontSize: 14,
          // stepSize: 1,
          beginAtZero: true,
          max: 100
        }
      }],
      xAxes: [{
        ticks: {
          fontColor: '#fefefe',
          fontSize: 14,
          // stepSize: 1,
          beginAtZero: true
        }
      }]
    },
    legend: {
      labels: {
        fontColor: '#fefefe'
      },
    }
  };
  lineChartBikeOptions: ChartOptions = {
    responsive: true,
    defaultColor: '#fefefe',
    scales: {
      yAxes: [{
        ticks: {
          fontColor: '#fefefe',
          fontSize: 14,
          // stepSize: 1,
          beginAtZero: true,
          stepSize: 1
        }
      }],
      xAxes: [{
        ticks: {
          fontColor: '#fefefe',
          fontSize: 14,
          // stepSize: 1,
          beginAtZero: true
        }
      }]
    },
    legend: {
      labels: {
        fontColor: '#fefefe'
      },
    }
  };

  lineChartColors: Color[] = [
    {
      borderColor: 'black',
      backgroundColor: 'rgba(0,255,4,0.28)',
    },
  ];

  lineChartLegend = true;
  lineChartPlugins: PluginServiceGlobalRegistrationAndOptions[] = [];
  lineChartType: ChartType = 'line';

  constructor() {
  }

  ngOnInit(): void {
    this.computeBatteryChart();
    this.computeBikeChart();
  }

  ngOnChanges(): void {
    this.computeBatteryChart();
    this.computeBikeChart();
  }


  private computeBatteryChart(): void {
    const moduloFilter = this.stationMonitorings?.length > 500 ? Math.round(this.stationMonitorings.length / 500) : 1;
    this.lineChartBatteryData = [
      {
        data: this.stationMonitorings
          ?.filter((value, index) => index % moduloFilter === 0).map(m => m.batteryPercent),
        label: 'Batterie de la station',
        spanGaps: true,
      }
    ];
    this.lineChartBatteryLabels = this.stationMonitorings
      ?.filter((value, index) => index % moduloFilter === 0).map(m => format(new Date(m.createdAt), 'yyyy-MM-dd HH:mm:ss'));
  }

  private computeBikeChart(): void {
    const moduloFilter = this.stationMonitorings?.length > 100 ? Math.round(this.stationMonitorings?.length / 100) : 1;
    this.lineChartBikeData = [
      {
        data: this.stationMonitorings
          ?.filter((value, index) => index % moduloFilter === 0).map(m => m.usedBikeSlot),
        label: 'Vélos disponibles',
        spanGaps: true,
      }
    ];
    this.lineChartBikeLabels = this.stationMonitorings
      ?.filter((value, index) => index % moduloFilter === 0).map(m => format(new Date(m.createdAt), 'yyyy-MM-dd HH:mm:ss'));
  }
}
