import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TeacherWeeklyprogPageRoutingModule } from './teacher-weeklyprog-routing.module';

import { TeacherWeeklyprogPage } from './teacher-weeklyprog.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TeacherWeeklyprogPageRoutingModule
  ],
  declarations: [TeacherWeeklyprogPage]
})
export class TeacherWeeklyprogPageModule {}
