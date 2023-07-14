import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TeacherWeeklyprogPageRoutingModule } from './teacher-weeklyprog-routing.module';

import { TeacherWeeklyprogPage } from './teacher-weeklyprog.page';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TeacherWeeklyprogPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [TeacherWeeklyprogPage]
})
export class TeacherWeeklyprogPageModule {}
