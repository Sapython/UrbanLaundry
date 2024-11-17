import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PickUpAddressPage } from './pick-up-address.page';

const routes: Routes = [
  {
    path: '',
    component: PickUpAddressPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PickUpAddressPageRoutingModule {}
