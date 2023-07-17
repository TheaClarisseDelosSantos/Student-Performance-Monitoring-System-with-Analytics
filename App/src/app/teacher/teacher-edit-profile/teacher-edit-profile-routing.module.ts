import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TeacherEditProfilePage } from './teacher-edit-profile.page';

const routes: Routes = [
  {
    path: '',
    component: TeacherEditProfilePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TeacherEditProfilePageRoutingModule {}
