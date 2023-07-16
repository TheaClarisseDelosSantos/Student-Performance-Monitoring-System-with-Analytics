import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GStudentsListPageRoutingModule } from './g-students-list-routing.module';

import { GStudentsListPage } from './g-students-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GStudentsListPageRoutingModule
  ],
  declarations: [GStudentsListPage]
})
export class GStudentsListPageModule {}
