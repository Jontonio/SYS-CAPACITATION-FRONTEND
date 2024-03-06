import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { facilitatorsRoutingModule } from './facilitators-routing.module';
import { facilitatorListComponent } from './pages/facilitator-list/facilitator-list.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormFacilitatorComponent } from './components/form-facilitator/form-facilitator.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    facilitatorsRoutingModule
  ],
  declarations: [facilitatorListComponent, FormFacilitatorComponent]
})
export class facilitatorsModule { }
