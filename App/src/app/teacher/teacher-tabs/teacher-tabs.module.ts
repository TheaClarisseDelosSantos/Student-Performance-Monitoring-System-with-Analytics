import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TeacherTabsPageRoutingModule } from './teacher-tabs-routing.module';

import { TeacherTabsPage } from './teacher-tabs.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TeacherTabsPageRoutingModule
  ],
  declarations: [TeacherTabsPage]
})
export class TeacherTabsPageModule {}
