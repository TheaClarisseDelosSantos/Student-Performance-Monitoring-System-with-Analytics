import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TeacherEditProfilePageRoutingModule } from './teacher-edit-profile-routing.module';

import { TeacherEditProfilePage } from './teacher-edit-profile.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TeacherEditProfilePageRoutingModule
  ],
  declarations: [TeacherEditProfilePage]
})
export class TeacherEditProfilePageModule {}
