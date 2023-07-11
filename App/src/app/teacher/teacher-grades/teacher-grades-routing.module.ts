import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TeacherGradesPage } from './teacher-grades.page';

const routes: Routes = [
  {
    path: '',
    component: TeacherGradesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TeacherGradesPageRoutingModule {}
