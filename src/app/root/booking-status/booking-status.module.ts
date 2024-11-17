import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BookingStatusPageRoutingModule } from './booking-status-routing.module';

import { BookingStatusPage } from './booking-status.page';
import { ComponentModule } from '../../Components/component.module';
import { WidgetsModule } from '../widgets/widgets.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BookingStatusPageRoutingModule,
    ComponentModule,
    WidgetsModule
  ],
  declarations: [BookingStatusPage]
})
export class BookingStatusPageModule {}
