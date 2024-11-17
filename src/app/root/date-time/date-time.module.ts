import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DateTimePageRoutingModule } from './date-time-routing.module';

import { DateTimePage } from './date-time.page';
import { SwiperModule } from 'swiper/angular';
import { ComponentModule } from '../../Components/component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DateTimePageRoutingModule,
    SwiperModule,
    ComponentModule
  ],
  declarations: [DateTimePage]
})
export class DateTimePageModule {}
