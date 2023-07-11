import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import {AuthGuard} from 'src/app/guards/auth.guard';
const routes: Routes = [
  {
    path: '',
    redirectTo: 'loader',
    pathMatch: 'full'
  },
  {
    path: 'loader',
    loadChildren: () => import('./pages/loader/loader.module').then( m => m.LoaderPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule),
    canActivate: [AuthGuard] 
  },
  {
    path: 'tabs',
    loadChildren: () => import('./pages/tabs/tabs.module').then( m => m.TabsPageModule),
    canActivate: [AuthGuard], 
    data: { roles: ['student', 'teacher', 'admin'] } 
  },
  {
    path: 'weeklyprog',
    loadChildren: () => import('./pages/weeklyprog/weeklyprog.module').then( m => m.WeeklyprogPageModule),
    canActivate: [AuthGuard] 
  },
  {
    path: 'grades',
    loadChildren: () => import('./pages/grades/grades.module').then( m => m.GradesPageModule),
    canActivate: [AuthGuard] 
  },
  {
    path: 'profile',
    loadChildren: () => import('./pages/profile/profile.module').then( m => m.ProfilePageModule),
    canActivate: [AuthGuard] 
  },
  {
    path: 'add-student',
    loadChildren: () => import('./admin/add-student/add-student.module').then( m => m.AddStudentPageModule)
  },
  {
    path: 'add-teacher',
    loadChildren: () => import('./admin/add-teacher/add-teacher.module').then( m => m.AddTeacherPageModule)
  },
  {
    path: 'teacher-home',
    loadChildren: () => import('./teacher/teacher-home/teacher-home.module').then( m => m.TeacherHomePageModule),
    canActivate: [AuthGuard] 
  },
  {
    path: 'teacher-tabs',
    loadChildren: () => import('./teacher/teacher-tabs/teacher-tabs.module').then( m => m.TeacherTabsPageModule),
    canActivate: [AuthGuard], 
    data: { roles: ['student', 'teacher', 'admin'] } 
  },
  {
    path: 'teacher-weeklyprog',
    loadChildren: () => import('./teacher/teacher-weeklyprog/teacher-weeklyprog.module').then( m => m.TeacherWeeklyprogPageModule),
    canActivate: [AuthGuard] 
  },
  {
    path: 'teacher-grades',
    loadChildren: () => import('./teacher/teacher-grades/teacher-grades.module').then( m => m.TeacherGradesPageModule),
    canActivate: [AuthGuard] 
  },
  {
    path: 'teacher-profile',
    loadChildren: () => import('./teacher/teacher-profile/teacher-profile.module').then( m => m.TeacherProfilePageModule),
    canActivate: [AuthGuard] 
  },




];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
