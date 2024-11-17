import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CancelRequestPage } from './cancel-request.page';

const routes: Routes = [
  {
    path: '',
    component: CancelRequestPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CancelRequestPageRoutingModule {}
