import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TeacherGradesPageRoutingModule } from './teacher-grades-routing.module';

import { TeacherGradesPage } from './teacher-grades.page';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TeacherGradesPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [TeacherGradesPage]
})
export class TeacherGradesPageModule {}
