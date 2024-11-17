import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RootPage } from './root.page';

const routes: Routes = [
  {
    path: '',
    component: RootPage,
    children: [
      {
        path: 'home',
        loadChildren: () =>
          import('./home/home.module').then((m) => m.HomePageModule),
      },
      {
        path: 'date-time/:id',
        loadChildren: () =>
          import('./date-time/date-time.module').then(
            (m) => m.DateTimePageModule
          ),
      },
      {
        path: 'change-address',
        loadChildren: () =>
          import('./date-time/date-time.module').then(
            (m) => m.DateTimePageModule
          ),
      },
      {
        path: 'booking-details/:id',
        loadChildren: () =>
          import('./booking-details/booking-details.module').then(
            (m) => m.BookingDetailsPageModule
          ),
      },
      {
        path: 'cancel-request/:id',
        loadChildren: () =>
          import('./cancel-request/cancel-request.module').then(
            (m) => m.CancelRequestPageModule
          ),
      },
      {
        path: 'notifications',
        loadChildren: () =>
          import('./notifications/notifications.module').then(
            (m) => m.NotificationsPageModule
          ),
      },
      {
        path: 'bookings',
        loadChildren: () =>
          import('./bookings/bookings.module').then(
            (m) => m.BookingsPageModule
          ),
      },
      {
        path: 'contact-us',
        loadChildren: () =>
          import('./contact-us/contact-us.module').then(
            (m) => m.ContactUsPageModule
          ),
      },
      {
        path: 'profile',
        loadChildren: () =>
          import('./profile/profile.module').then((m) => m.ProfilePageModule),
      },
      {
        path: 'settings',
        loadChildren: () =>
          import('./settings/settings.module').then(
            (m) => m.SettingsPageModule
          ),
      },
      {
        path: 'invite',
        loadChildren: () =>
          import('./invite/invite.module').then((m) => m.InvitePageModule),
      },
      {
        path: 'pick-up-address',
        loadChildren: () =>
          import('./pick-up-address/pick-up-address.module').then(
            (m) => m.PickUpAddressPageModule
          ),
      },
      {
        path: 'booking-status/:id',
        loadChildren: () =>
          import('./booking-status/booking-status.module').then(
            (m) => m.BookingStatusPageModule
          ),
      },

      {
        path: 'rating',
        loadChildren: () =>
          import('./rating/rating.module').then((m) => m.RatingPageModule),
      },
      {
        path: 'manage-address',
        loadChildren: () =>
          import('./manage-address/manage-address.module').then(
            (m) => m.ManageAddressPageModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RootPageRoutingModule {}
