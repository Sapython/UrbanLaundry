import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BookingStatusPage } from './booking-status.page';

const routes: Routes = [
  {
    path: '',
    component: BookingStatusPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BookingStatusPageRoutingModule {}
