import { Component, Input } from '@angular/core';
import { ResReport } from '../../../features/dashboard/interfaces/ResReport';
import { LegendPosition } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-vertical-bar-chart',
  templateUrl: './vertical-bar-chart.component.html',
  styleUrls: ['./vertical-bar-chart.component.css']
})
export class VerticalBarChartComponent {

  @Input() data: ResReport[] =[];

  view: any[] = [700, 400];

  // options
  showXAxis = true;
  showYAxis = true;
  gradient = true;
  showLegend = false;
  showXAxisLabel = true;
  xAxisLabel = 'Meses';
  showYAxisLabel = true;
  yAxisLabel = 'Total de eventos';
  legendPosition: LegendPosition = LegendPosition.Below;

  constructor() {
    Object.assign(this, { single:this.data })
  }

}
