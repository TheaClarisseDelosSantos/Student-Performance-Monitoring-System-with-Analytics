import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TeacherGradesPageRoutingModule } from './teacher-grades-routing.module';

import { TeacherGradesPage } from './teacher-grades.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TeacherGradesPageRoutingModule
  ],
  declarations: [TeacherGradesPage]
})
export class TeacherGradesPageModule {}
