import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HanddleErrorInterceptor } from 'src/app/core/interceptors/handdle-error-interceptor.interceptor';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MainRoutingModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HanddleErrorInterceptor,
      multi: true
    }
  ]
})
export class MainModule { }
