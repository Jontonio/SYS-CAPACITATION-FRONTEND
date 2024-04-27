import { Component, Input, OnInit } from '@angular/core';
import { ResReport } from '../../../features/dashboard/interfaces/ResReport';
import { LegendPosition } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-horizontal-bar-chart',
  templateUrl: './horizontal-bar-chart.component.html',
  styleUrls: ['./horizontal-bar-chart.component.css']
})
export class HorizontalBarChartComponent {

  @Input() data: ResReport[] = [];

  // options
  showXAxis: boolean = true;
  showYAxis: boolean = true;
  gradient: boolean = true;
  showLegend: boolean = false;
  showXAxisLabel: boolean = true;
  yAxisLabel: string = 'CARGOS';
  showYAxisLabel: boolean = true;
  xAxisLabel: string = 'CANTIDAD DE ASISTENTES';
  legendPosition: LegendPosition = LegendPosition.Right;

  colorScheme:any= {
    domain: ['#ca6702','#bb3e03','#ae2012','#9b2226']
  };

  constructor() {
    Object.assign(this, { single:this.data });
  }

}
