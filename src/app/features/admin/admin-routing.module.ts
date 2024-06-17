import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';

const routes: Routes = [
  {
    path:'',
    component:LayoutComponent,
    children:[
      { 
        path:'facilitators',
        loadChildren: () => import('../facilitators/facilitators.module').then(m => m.facilitatorsModule),
      },
      { 
        path:'projects',
        loadChildren: () => import('../projects/projects.module').then(m => m.projectsModule),
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
