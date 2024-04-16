import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HasNotRoleRoutingModule } from './has-not-role-routing.module';
import { LayoutComponent } from './layout/layout.component';


@NgModule({
  declarations: [
    LayoutComponent
  ],
  imports: [
    CommonModule,
    HasNotRoleRoutingModule
  ]
})
export class HasNotRoleModule { }
