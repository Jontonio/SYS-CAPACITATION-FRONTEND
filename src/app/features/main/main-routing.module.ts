import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'dashboard',
    loadChildren: () => import('../dashboard/dashboard.module').then(m => m.DashboardModule),
  },
  {
    path: 'projects',
    loadChildren: () => import('../projects/projects.module').then(m => m.projectsModule),
  },
  {
    path: 'facilitators',
    loadChildren: () => import('../facilitators/facilitators.module').then(m => m.facilitatorsModule),
  },
  {
    path: 'administrables',
    loadChildren: () => import('../administrable/administrable.module').then(m => m.administrableModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
