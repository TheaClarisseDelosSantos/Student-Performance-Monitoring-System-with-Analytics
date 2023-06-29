import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WeeklyprogPageRoutingModule } from './weeklyprog-routing.module';

import { WeeklyprogPage } from './weeklyprog.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WeeklyprogPageRoutingModule
  ],
  declarations: [WeeklyprogPage]
})
export class WeeklyprogPageModule {}
