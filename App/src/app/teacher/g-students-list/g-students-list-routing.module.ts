import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GStudentsListPage } from './g-students-list.page';

const routes: Routes = [
  {
    path: '',
    component: GStudentsListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GStudentsListPageRoutingModule {}
