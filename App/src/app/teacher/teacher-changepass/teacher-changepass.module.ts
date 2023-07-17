import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TeacherChangepassPageRoutingModule } from './teacher-changepass-routing.module';

import { TeacherChangepassPage } from './teacher-changepass.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TeacherChangepassPageRoutingModule
  ],
  declarations: [TeacherChangepassPage]
})
export class TeacherChangepassPageModule {}
