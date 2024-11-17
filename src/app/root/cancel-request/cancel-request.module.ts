import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CancelRequestPageRoutingModule } from './cancel-request-routing.module';

import { CancelRequestPage } from './cancel-request.page';
import { ComponentModule } from '../../Components/component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CancelRequestPageRoutingModule,
    ComponentModule
  ],
  declarations: [CancelRequestPage]
})
export class CancelRequestPageModule {}
