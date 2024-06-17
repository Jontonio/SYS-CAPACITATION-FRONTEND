import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { LayoutComponent } from './layout/layout.component';
import { CustomMaterialModule } from 'src/app/custom-material/custom-material.module';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    LayoutComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    CustomMaterialModule,
    AdminRoutingModule,
    CustomMaterialModule
  ]
})
export class AdminModule { }
