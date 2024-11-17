import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ManageAddressPageRoutingModule } from './manage-address-routing.module';

import { ManageAddressPage } from './manage-address.page';
import { ComponentModule } from '../../Components/component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ManageAddressPageRoutingModule,
    ComponentModule
  ],
  declarations: [ManageAddressPage]
})
export class ManageAddressPageModule {}
