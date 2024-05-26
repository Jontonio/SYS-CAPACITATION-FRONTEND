import { Component, Input } from '@angular/core';
import { ResReport } from '../../../features/dashboard/interfaces/ResReport';
import { LegendPosition } from '@swimlane/ngx-charts';
import { LocalService } from 'src/app/core/services/local.service';

@Component({
  selector: 'app-vertical-bar-chart',
  templateUrl: './vertical-bar-chart.component.html',
  styleUrls: ['./vertical-bar-chart.component.css']
})
export class VerticalBarChartComponent {

  @Input() data: ResReport[] =[];

  // options
  @Input() xAxisLabel = 'Meses';
  @Input() yAxisLabel = 'Total de eventos';
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = false;
  showXAxisLabel = true;
  showYAxisLabel = true;
  legendPosition: LegendPosition = LegendPosition.Below;

  constructor(public _local:LocalService) {
    Object.assign(this, { single:this.data })
  }

}
