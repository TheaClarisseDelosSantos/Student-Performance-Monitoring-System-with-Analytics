import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TeacherWeeklyprogPage } from './teacher-weeklyprog.page';

const routes: Routes = [
  {
    path: '',
    component: TeacherWeeklyprogPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TeacherWeeklyprogPageRoutingModule {}
