import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PickUpAddressPageRoutingModule } from './pick-up-address-routing.module';

import { PickUpAddressPage } from './pick-up-address.page';
import { ComponentModule } from '../../Components/component.module';
import { GoogleMapsModule } from '@angular/google-maps';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PickUpAddressPageRoutingModule,
    ComponentModule,
    GoogleMapsModule,
    ReactiveFormsModule
  ],
  declarations: [PickUpAddressPage]
})
export class PickUpAddressPageModule {}
