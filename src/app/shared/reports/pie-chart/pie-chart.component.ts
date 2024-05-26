import { Component, Input } from '@angular/core';
import { LegendPosition } from '@swimlane/ngx-charts';
import { ResReport } from '../../../features/dashboard/interfaces/ResReport';
import { LocalService } from 'src/app/core/services/local.service';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.css']
})
export class PieChartComponent {

  @Input() data: ResReport[] = [];

  // options
  gradient: boolean = false;
  showLegend: boolean = false;
  showLabels: boolean = true;
  isDoughnut: boolean = false;
  legendPosition: LegendPosition = LegendPosition.Right;

  colorScheme:any= {
    domain: ['#e9d8a6','#ee9b00','#ca6702','#bb3e03','#ae2012','#9b2226']
  };

  constructor(public _local:LocalService) {
    Object.assign(this, { single:this.data });
  }

}