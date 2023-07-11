import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TeacherTabsPage } from './teacher-tabs.page';

const routes: Routes = [
  {
    path: 'teacher-tabs',
    component: TeacherTabsPage,
    children:[
      {path:"teacher-home", loadChildren:()=>import('src/app/teacher/teacher-home/teacher-home.module').then(res => res.TeacherHomePageModule)},
      {path:"teacher-weeklyprog", loadChildren:()=>import('src/app/teacher/teacher-weeklyprog/teacher-weeklyprog.module').then(res => res.TeacherWeeklyprogPageModule)},
      {path:"teacher-grades", loadChildren:()=>import('src/app/teacher/teacher-grades/teacher-grades.module').then(res => res.TeacherGradesPageModule)},
      {path:"teacher-profile", loadChildren:()=>import('src/app/teacher/teacher-profile/teacher-profile.module').then(res => res.TeacherProfilePageModule)},



    ]
  },
  {
    path:"",
    redirectTo:"teacher-tabs/teacher-home",
    pathMatch:"full"
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TeacherTabsPageRoutingModule {}
