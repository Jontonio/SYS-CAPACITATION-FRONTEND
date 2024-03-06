import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { administrableRoutingModule } from './administrable-routing.module';
import { AccountPageComponent } from './administrable-page/administrable-page.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ProfileDetailsComponent } from './profile-details/profile-details.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormChargeComponent } from './components/form-charge/form-charge.component';
import { ListChargesComponent } from './components/list-charges/list-charges.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    administrableRoutingModule
  ],
  declarations: [AccountPageComponent, ChangePasswordComponent, ProfileDetailsComponent, FormChargeComponent, ListChargesComponent],
  exports: [AccountPageComponent]
})
export class administrableModule { }
