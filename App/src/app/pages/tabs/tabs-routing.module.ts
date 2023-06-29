import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children:[
      {path:"home", loadChildren:() => import('src/app/pages/home/home.module').then(res=> res.HomePageModule)},
      {path:"weeklyprog", loadChildren:() => import('src/app/pages/weeklyprog/weeklyprog.module').then(res => res.WeeklyprogPageModule)},
      {path:"grades", loadChildren:() => import('src/app/pages/grades/grades.module').then(res => res.GradesPageModule)},
      {path:"profile", loadChildren:() => import('src/app/pages/profile/profile.module').then(res => res.ProfilePageModule)}
    ]
  },
  {
    path:"",
    redirectTo:"tabs/home",
    pathMatch:"full"
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
