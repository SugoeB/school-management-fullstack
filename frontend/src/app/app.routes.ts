import { Routes } from '@angular/router';

import { authGuard } from './core/guards/auth.guard';

import { MainLayoutComponent } from './layout/main-layout/main-layout.component';

import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { SchoolsComponent } from './pages/schools/schools.component';
import { TeachersComponent } from './pages/teachers/teachers.component';
import { StudentsComponent } from './pages/students/students.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },

  {
    path: 'register',
    component: RegisterComponent,
  },

  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      {
        path: 'schools',
        component: SchoolsComponent,
      },
      {
        path: 'teachers',
        component: TeachersComponent,
      },
      {
        path: 'students',
        component: StudentsComponent,
      },
    ],
  },

  {
    path: '**',
    redirectTo: '',
  },
];