import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TeacherChangepassPage } from './teacher-changepass.page';

const routes: Routes = [
  {
    path: '',
    component: TeacherChangepassPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TeacherChangepassPageRoutingModule {}
