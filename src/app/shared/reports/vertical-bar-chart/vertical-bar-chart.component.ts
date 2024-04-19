import { Component, Input } from '@angular/core';
import { ResReport } from '../../../features/dashboard/interfaces/ResReport';

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
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'AÑOS';
  showYAxisLabel = true;
  yAxisLabel = 'Número de proyectos';

  constructor() {
    Object.assign(this, { single:this.data })
  }

}
