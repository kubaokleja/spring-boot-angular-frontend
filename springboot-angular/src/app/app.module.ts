import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthInterceptor } from './interceptor/auth.interceptor';
import { AuthenticationGuard } from './guard/authentication.guard';
import { LoginComponent } from './component/login/login.component';
import { RegisterComponent } from './component/register/register.component';
import { FormsModule } from '@angular/forms';
import { HomeComponent } from './component/home/home.component';
import { NotificationModule } from './notification.module';
import { UserManagementComponent } from './component/user-management/user-management.component';
import { UserDetailsComponent } from './component/user-details/user-details.component';
import { RegisterConfirmationComponent } from './component/register-confirmation/register-confirmation.component';
import { MatchPasswordDirective } from './directive/match-password.directive';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { AboutMeComponent } from './component/about-me/about-me.component';
import { FootballComponent } from './component/football/football.component';
import { TopScorerComponent } from './component/football/children/top-scorer/top-scorer.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    UserManagementComponent,
    UserDetailsComponent,
    RegisterConfirmationComponent,
    MatchPasswordDirective,
    AboutMeComponent,
    FootballComponent,
    TopScorerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    NotificationModule,
    LeafletModule
  ],
  providers: [AuthenticationGuard, {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
