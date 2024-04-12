import { Component, Input } from '@angular/core';
import { LegendPosition } from '@swimlane/ngx-charts';
import { ResReport } from '../../interfaces/ResReport';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.css']
})
export class PieChartComponent {

  @Input() data: ResReport[] = [];

  // options
  gradient: boolean = true;
  showLegend: boolean = true;
  showLabels: boolean = true;
  isDoughnut: boolean = false;
  legendPosition:LegendPosition = LegendPosition.Right;

  colorScheme:any= {
    domain: ['#e9d8a6','#ee9b00','#ca6702','#bb3e03','#ae2012','#9b2226']
  };

  constructor() {
    Object.assign(this, { single:this.data });
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
