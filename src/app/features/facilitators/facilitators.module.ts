import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { facilitatorsRoutingModule } from './facilitators-routing.module';
import { facilitatorListComponent } from './pages/facilitator-list/facilitator-list.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    facilitatorsRoutingModule
  ],
  declarations: [facilitatorListComponent]
})
export class facilitatorsModule { }
