import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './core/guards/auth.guard';

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
    path:'main',
    loadChildren: () => import('./features/main/main.module').then(m => m.MainModule),
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
