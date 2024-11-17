import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TermsConditionPageRoutingModule } from './terms-condition-routing.module';

import { TermsConditionPage } from './terms-condition.page';
import { ComponentModule } from '../../Components/component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TermsConditionPageRoutingModule,
    ComponentModule
  ],
  declarations: [TermsConditionPage]
})
export class TermsConditionPageModule {}
