import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LandingPageRoutingModule } from './landing-page-routing.module';
import { PageIndexComponent } from './pages/page-index/page-index.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { CustomMaterialModule } from 'src/app/custom-material/custom-material.module';


@NgModule({
  declarations: [
    PageIndexComponent,
    NavbarComponent,
  ],
  imports: [
    CommonModule,
    LandingPageRoutingModule,
    CustomMaterialModule
  ]
})
export class LandingPageModule { }
