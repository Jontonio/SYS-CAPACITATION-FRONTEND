import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-card-number-chart',
  templateUrl: './card-number-chart.component.html',
  styleUrls: ['./card-number-chart.component.css']
})
export class CardNumberChartComponent {

  single: any[] = [
    {
      "name": "Germany",
      "value": 8940000
    },
    {
      "name": "USA",
      "value": 5000000
    },
    {
      "name": "France",
      "value": 7200000
    },
    {
      "name": "UK",
      "value": 5200000
    },
    {
      "name": "Italy",
      "value": 7700000
    }
  ];

  view:[number, number] = [700, 400];

  colorScheme:any= {
    domain: ['#e9d8a6','#ee9b00','#ca6702','#bb3e03','#ae2012','#9b2226']
  };

  cardColor: string = '#232837';
  
  constructor() {
    Object.assign(this, { single:this.single });
  }

  onSelect(event:Event) {
    console.log(event);
  }

}
