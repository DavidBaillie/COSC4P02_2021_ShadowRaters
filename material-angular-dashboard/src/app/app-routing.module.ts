import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

import {LayoutsModule} from './layouts';
import {CommonLayoutComponent} from './layouts/common-layout';
import {HomePageComponent} from './pages/homePage';
import {PasswordChangeComponent} from "./pages/pages/changePassword";
import {SearchInstitution} from './pages/search/search-institution';
import {SearchDepartment} from './pages/search/search-department';
import {SearchProfessor} from './pages/search/search-professor';
import {SearchCourse} from './pages/search/search-course';
import {AboutComponent} from './pages/about';
import {DetailsComponent} from './pages/detailPage';

@NgModule({
  imports: [
    RouterModule.forRoot(
      [
        {path: '', redirectTo: 'app/home', pathMatch: 'full'},
        {
          path: 'app', component: CommonLayoutComponent, children: [
            {path: 'home', component: HomePageComponent, pathMatch: 'full'},
            {path: 'search/professors', component: SearchProfessor, pathMatch: 'full'},
            {path: 'search/courses', component: SearchCourse, pathMatch: 'full'},
            {path: 'search/institutions', component: SearchInstitution, pathMatch: 'full'},
            {path: 'search/departments', component: SearchDepartment, pathMatch: 'full'},
            {path: 'details/:type/:id', component: DetailsComponent, pathMatch: 'full'},
            {path: 'about', component: AboutComponent, pathMatch: 'full'},
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
