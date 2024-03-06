import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from 'src/app/shared/layout/layout.component';

import { CustomerListComponent } from './pages/projects-list/projects-list.component';
import { ViewProjectComponent } from './pages/view-project/view-project.component';
import { ListEventsComponent } from './pages/list-events/list-events.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', component: CustomerListComponent },
      { 
        path: 'project-id/:id_project', component: ViewProjectComponent,
        children:[
          {
            path:'list-events',
            component:ListEventsComponent
          }
        ]
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class projectsRoutingModule { }
