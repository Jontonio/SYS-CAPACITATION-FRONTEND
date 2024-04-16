import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ProjectComponent } from './pages/project/project.component';
import { EventListComponent } from './pages/event-list/event-list.component';
import { EventComponent } from './pages/event/event.component';
import { ProjectListComponent } from './pages/project-list/project-list.component';

const routes: Routes = [
  {
    path:'',
    component:LayoutComponent,
    children:[
      {
        path:'dashboard',
        component:DashboardComponent
      },
      {
        path:'project',
        component:ProjectComponent,
        children:[
          {
            path:'list',
            component:ProjectListComponent,
          },
          {
            path:':id_project',
            component:EventListComponent,
          },
          {
            path:':id_project/:id_event',
            component:EventComponent
          }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StationRoutingModule { }
