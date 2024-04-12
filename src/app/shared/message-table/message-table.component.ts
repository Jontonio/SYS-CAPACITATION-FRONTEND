import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-message-table',
  templateUrl: './message-table.component.html',
  styleUrls: ['./message-table.component.css']
})
export class MessageTableComponent {

  @Input() msg:string = 'Lista vacia';

  constructor() { }

}
