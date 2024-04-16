import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';

const appRoutes: Routes = [
  // {
  //   path:'landing',
  //   loadChildren: () => import('./features/landing-page/landing-page.module').then( m => m.LandingPageModule)
  // },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule),
  },
  {
    path:'root',
    loadChildren: () => import('./features/root/root.module').then(m => m.RootModule),
    canActivate: [AuthGuard, RoleGuard],
    data:{ rolesPermitidos:['root'] }
  },
  {
    path:'admin',
    loadChildren: () => import('./features/admin/admin.module').then(m => m.AdminModule),
    canActivate: [AuthGuard, RoleGuard],
    data:{ rolesPermitidos:['admin'] }
  },
  {
    path:'station/:id_inia_station',
    loadChildren: () => import('./features/station/station.module').then(m => m.StationModule),
    canActivate: [AuthGuard, RoleGuard],
    data:{ rolesPermitidos:['station'] }
  },
  {
    path:'viewer',
    loadChildren: () => import('./features/admin/admin.module').then(m => m.AdminModule),
    canActivate: [AuthGuard, RoleGuard],
    data:{ rolesPermitidos:['viewer'] }
  },
  {
    path:'has-no-role',
    loadChildren: () => import('./features/has-not-role/has-not-role.module').then(m => m.HasNotRoleModule),
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    redirectTo: 'auth',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes,{ useHash:true })
  ],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }
