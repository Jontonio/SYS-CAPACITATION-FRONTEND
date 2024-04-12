import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-spinner-loadding',
  templateUrl: './spinner-loadding.component.html',
  styleUrls: ['./spinner-loadding.component.css']
})
export class SpinnerLoaddingComponent {

  @Input() msg:string = 'Cargando...';
  
  constructor() { }

}
