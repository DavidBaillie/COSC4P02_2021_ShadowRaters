import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AuthInterceptor, AuthService, FakeBackendInterceptor } from '@services/*';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DepartmentsModule } from './pages/departments';
import { InstitutionsModule } from './pages/institutions';

import { DashboardModule } from './pages/dashboard';
import { FormsModule } from './pages/forms';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    InstitutionsModule,
    DashboardModule,
    FormsModule,
    DepartmentsModule,
    HttpClientModule,
  ],
  providers: [
    AuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: FakeBackendInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
