import { Component } from '@angular/core';
import { LoaddingService } from 'src/app/core/services/Loadding.service';

@Component({
  selector: 'app-ngx-spinner',
  templateUrl: './ngx-spinner.component.html',
  styleUrls: ['./ngx-spinner.component.css']
})
export class NgxSpinnerComponent {

  constructor(public loaddService:LoaddingService) { }

}
