import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BookingDetailsPageRoutingModule } from './booking-details-routing.module';

import { BookingDetailsPage } from './booking-details.page';
import { ComponentModule } from '../../Components/component.module';
import { LottieModule } from 'ngx-lottie';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BookingDetailsPageRoutingModule,
    ComponentModule,
    LottieModule
  ],
  declarations: [BookingDetailsPage]
})
export class BookingDetailsPageModule {}
