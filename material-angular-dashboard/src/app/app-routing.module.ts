import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

import {LayoutsModule} from './layouts';
import {CommonLayoutComponent} from './layouts/common-layout';
import {DepartmentsComponent} from './pages/departments';
import {ComponentsComponent} from './pages/institutions';
import {InstitutionDetailsComponent} from './pages/institutionDetails';
import {DashboardComponent} from './pages/dashboard';
import {FormsComponent} from "./pages/forms";
import { SearchProfessor } from './pages/search/search-professor';
import { SearchInstitution } from './pages/search/search-institution';
import { SearchCourse } from './pages/search/search-course';
import { SearchDepartment } from './pages/search/search-department';
import { AboutComponent } from './pages/about';

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
            {path: 'professors', component: SearchProfessor, pathMatch: 'full'},
            {path: 'professorX', component: InstitutionDetailsComponent, pathMatch: 'full' },
            {path: 'departments', component: SearchDepartment, pathMatch: 'full'},
            {path: 'courses', component: SearchCourse, pathMatch: 'full'},
            {path: 'institutions', component: SearchInstitution, pathMatch: 'full'},
            {path: 'institutionDetails', component: InstitutionDetailsComponent, pathMatch: 'full'},
            {path: 'about', component: AboutComponent, pathMatch: 'full'},
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
