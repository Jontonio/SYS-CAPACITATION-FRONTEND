import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StationRoutingModule } from './station-routing.module';
import { LayoutComponent } from './layout/layout.component';
import { CustomMaterialModule } from 'src/app/custom-material/custom-material.module';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ProjectComponent } from './pages/project/project.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { EventListComponent } from './pages/event-list/event-list.component';
import { EventComponent } from './pages/event/event.component';
import { ProjectListComponent } from './pages/project-list/project-list.component';


@NgModule({
  declarations: [
    LayoutComponent,
    DashboardComponent,
    ProjectComponent,
    EventListComponent,
    EventComponent,
    ProjectListComponent
  ],
  imports: [
    CommonModule,
    CustomMaterialModule,
    StationRoutingModule,
    SharedModule
  ]
})
export class StationModule { }
