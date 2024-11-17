import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthPage } from './auth.page';

const routes: Routes = [
  {
    path: '',
    component: AuthPage,
    children:[
      {
        path: 'signup',
        redirectTo:'phone',
        pathMatch:'full'
        // loadChildren: () =>
        //   import('./signup/signup.module').then((m) => m.SignupPageModule),
      },
      {
        path: 'forgotPassword',
        loadChildren: () =>
          import('./forgot-password/forgot-password.module').then(
            (m) => m.ForgotPasswordPageModule
          ),
      },
      {
        path: 'otpVerify',
        loadChildren: () =>
          import('./otp-verify/otp-verify.module').then(
            (m) => m.OtpVerifyPageModule
          ),
      },
      {
        path: 'phone',
        loadChildren: () =>
          import('./phone/phone.module').then(
            (m) => m.PhonePageModule
          ),
      },
      {
        path: 'verify-phone',
        loadChildren: () =>
          import('./verify-phone/verify-phone.module').then(
            (m) => m.VerifyPhonePageModule
          ),
      },
      {
        path: 'login',
        redirectTo:'phone',
        pathMatch:'full'
        // loadChildren: () =>
        //   import('./login/login.module').then((m) => m.LoginPageModule),
      },
      {
        path: 'terms-condition',
        loadChildren: () =>
          import('./terms-condition/terms-condition.module').then(
            (m) => m.TermsConditionPageModule
          ),
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthPageRoutingModule {}
