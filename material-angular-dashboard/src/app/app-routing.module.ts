import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { LayoutsModule } from './layouts';
import { CommonLayoutComponent } from './layouts/common-layout';
import { ChartsComponent } from './pages/charts';
import { ComponentsComponent } from './pages/components';
import { DashboardComponent } from './pages/dashboard';
import { Dashboard2Component } from './pages/dashboard2';

// @ts-ignore
// @ts-ignore
// @ts-ignore
@NgModule({
  imports: [
    RouterModule.forRoot(
      [
        { path: '', redirectTo: 'app/home', pathMatch: 'full' },
        { path: 'app', component: CommonLayoutComponent, children: [
          { path: 'home', component: DashboardComponent, pathMatch: 'full' },
          { path: 'professors', component: Dashboard2Component, pathMatch: 'full' },
          { path: 'departments', component: ChartsComponent, pathMatch: 'full'},
          { path: 'courses', component: ChartsComponent, pathMatch: 'full'},
          { path: 'institutions', component: ComponentsComponent, pathMatch: 'full' },
          { path: 'about', component: ComponentsComponent, pathMatch: 'full' },
          { path: '**', redirectTo: '/ypages/404' },
        ] }, // add 'canActivate: AuthGuard' for catching unauth users
        { path: '**', redirectTo: '/pages/404' },
      ],
      { useHash: true },
    ),
    LayoutsModule,
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
