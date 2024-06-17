import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from 'src/app/features/main/layout/layout.component';

import { CustomerListComponent } from './pages/projects-list/projects-list.component';
import { ViewProjectComponent } from './pages/view-project/view-project.component';
import { ListEventsComponent } from './pages/list-events/list-events.component';
import { ViewEventComponent } from './pages/view-event/view-event.component';

const routes: Routes = [
  { 
    path: '', component: CustomerListComponent 
  },
  { 
    path: 'project/:id_project', component: ViewProjectComponent,
    children:[
      {
        path:'list-events',
        component:ListEventsComponent
      },
      {
        path:'event/:id_event',
        component:ViewEventComponent
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class projectsRoutingModule { }
