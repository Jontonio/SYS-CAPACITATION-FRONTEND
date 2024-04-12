import { Component, Input, OnInit } from '@angular/core';
import { LegendPosition } from '@swimlane/ngx-charts';
import { ResReport, ResReportSeries } from '../../interfaces/ResReport';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css']
})
export class LineChartComponent {

  @Input() data: ResReportSeries[] = [
    {
      "name": "Bolivia",
      "series": [
        {
          "value": 5764,
          "name": "2016-09-18T21:24:57.125Z"
        },
        {
          "value": 6137,
          "name": "2016-09-15T11:46:17.027Z"
        },
        {
          "value": 3618,
          "name": "2016-09-15T17:12:59.436Z"
        },
        {
          "value": 2769,
          "name": "2016-09-22T08:32:02.439Z"
        },
        {
          "value": 3842,
          "name": "2016-09-18T17:17:55.984Z"
        }
      ]
    },
    {
      "name": "Albania",
      "series": [
        {
          "value": 6890,
          "name": "2016-09-18T21:24:57.125Z"
        },
        {
          "value": 5430,
          "name": "2016-09-15T11:46:17.027Z"
        },
        {
          "value": 4960,
          "name": "2016-09-15T17:12:59.436Z"
        },
        {
          "value": 4284,
          "name": "2016-09-22T08:32:02.439Z"
        },
        {
          "value": 2092,
          "name": "2016-09-18T17:17:55.984Z"
        }
      ]
    },
    {
      "name": "Réunion",
      "series": [
        {
          "value": 5590,
          "name": "2016-09-18T21:24:57.125Z"
        },
        {
          "value": 4211,
          "name": "2016-09-15T11:46:17.027Z"
        },
        {
          "value": 4254,
          "name": "2016-09-15T17:12:59.436Z"
        },
        {
          "value": 3839,
          "name": "2016-09-22T08:32:02.439Z"
        },
        {
          "value": 4480,
          "name": "2016-09-18T17:17:55.984Z"
        }
      ]
    },
    {
      "name": "South Georgia",
      "series": [
        {
          "value": 3314,
          "name": "2016-09-18T21:24:57.125Z"
        },
        {
          "value": 6386,
          "name": "2016-09-15T11:46:17.027Z"
        },
        {
          "value": 4819,
          "name": "2016-09-15T17:12:59.436Z"
        },
        {
          "value": 6342,
          "name": "2016-09-22T08:32:02.439Z"
        },
        {
          "value": 4611,
          "name": "2016-09-18T17:17:55.984Z"
        }
      ]
    },
    {
      "name": "Mayotte",
      "series": [
        {
          "value": 2641,
          "name": "2016-09-18T21:24:57.125Z"
        },
        {
          "value": 3892,
          "name": "2016-09-15T11:46:17.027Z"
        },
        {
          "value": 4265,
          "name": "2016-09-15T17:12:59.436Z"
        },
        {
          "value": 5410,
          "name": "2016-09-22T08:32:02.439Z"
        },
        {
          "value": 5525,
          "name": "2016-09-18T17:17:55.984Z"
        }
      ]
    }
  ];

  view: any[] = [700, 300];

  // options
  legend: boolean = true;
  showLabels: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'Year';
  yAxisLabel: string = 'Population';
  timeline: boolean = true;
  
  colorScheme:any= {
    domain: ['#e9d8a6','#ee9b00','#ca6702','#bb3e03','#ae2012','#9b2226']
  };

  constructor() {
    Object.assign(this, { multi:this.data });
  }

  onSelect(data:any): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data:any): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data:any): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }

}
