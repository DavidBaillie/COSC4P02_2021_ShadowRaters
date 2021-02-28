import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

import {LayoutsModule} from './layouts';
import {CommonLayoutComponent} from './layouts/common-layout';
import {DepartmentsComponent} from './pages/departments';
import {ComponentsComponent} from './pages/institutions';
import {InstitutionDetailsComponent} from './pages/institutionDetails';
import {DashboardComponent} from './pages/dashboard';
import {Dashboard2Component} from './pages/dashboard2';
import {FormsComponent} from "./pages/forms";

// @ts-ignore
// @ts-ignore
// @ts-ignore
@NgModule({
  imports: [
    RouterModule.forRoot(
      [
        {path: '', redirectTo: 'app/home', pathMatch: 'full'},
        {
          path: 'app', component: CommonLayoutComponent, children: [
            {path: 'home', component: DashboardComponent, pathMatch: 'full'},
            {path: 'professors', component: Dashboard2Component, pathMatch: 'full'},
            {path: 'departments', component: DepartmentsComponent, pathMatch: 'full'},
            {path: 'courses', component: DepartmentsComponent, pathMatch: 'full'},
            {path: 'institutions', component: ComponentsComponent, pathMatch: 'full'},
            {path: 'institutionDetails', component: InstitutionDetailsComponent, pathMatch: 'full'},
            {path: 'about', component: ComponentsComponent, pathMatch: 'full'},
            {path: 'account', component: FormsComponent, pathMatch: 'full'},

            {path: '**', redirectTo: '/ypages/404'},
          ]
        }, // add 'canActivate: AuthGuard' for catching unauth users
        {path: 'pages', loadChildren: () => import('./pages/pages/pages.module').then(m => m.PagesModule)}, //This allows requests for visiting child pages under this path.(short url + auto mapping)
        {path: '**', redirectTo: '/pages/404'},
      ],
      {useHash: true},
    ),
    LayoutsModule,
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
