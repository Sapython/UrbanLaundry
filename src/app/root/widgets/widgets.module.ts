import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingCardComponent } from './booking-card/booking-card.component';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [BookingCardComponent],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule
  ],
  exports:[BookingCardComponent]
})
export class WidgetsModule { }
