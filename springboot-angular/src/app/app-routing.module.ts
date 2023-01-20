import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './component/home/home.component';
import { LoginComponent } from './component/login/login.component';
import { RegisterConfirmationComponent } from './component/register-confirmation/register-confirmation.component';
import { RegisterComponent } from './component/register/register.component';
import { UserDetailsComponent } from './component/user-details/user-details.component';
import { UserManagementComponent } from './component/user-management/user-management.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'register/confirm', component: RegisterConfirmationComponent},
  {path: 'users', component: UserManagementComponent},
  {path: 'user/:userId', component: UserDetailsComponent},
  {path: '**', redirectTo: '/', pathMatch: 'full'}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
