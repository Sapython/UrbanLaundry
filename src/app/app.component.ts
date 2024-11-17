import { Component, Input, OnInit } from '@angular/core';
import {
  NavController,
  Platform,
  PopoverController,
} from '@ionic/angular';

import { Router } from '@angular/router';

import { doc, docData, Firestore } from '@angular/fire/firestore';
import { Auth, authState, User } from '@angular/fire/auth';
import { EMPTY, Observable, Subject } from 'rxjs';

import { AuthService } from 'src/services/Auth/auth.service';
import { urls } from 'src/services/url';
import { DataProviderService } from 'src/services/Data-Provider/data-provider.service';
import { DatabaseService } from 'src/services/DataBase/database.service';
import { notificationStructure } from 'src/structures/notification.structure';
import { NotificationPopOverComponent } from './notification-pop-over/notification-pop-over.component';
import { UserData } from 'src/structures/user.structure';
import { App } from '@capacitor/app';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public readonly user: Observable<User | null> = EMPTY;
  public window: any = window;
  public loggedInUserData: Subject<any> = new Subject();
  disabledTabs: string[] = [
    '/login',
    '/signup',
    '/forgotPassword',
    '/otpVerify',
    '/phone',
    '/verify-phone',
    '/loading',
  ];
  public userdata: any;
  var: number = 0;
  constructor(
    public authService: AuthService,
    private router: Router,
    private auth: Auth,
    public dataProvider: DataProviderService,
    private fs: Firestore,
    private database: DatabaseService,
    private popOverController: PopoverController,
    private platform:Platform
  ) {
    this.platform.backButton.subscribeWithPriority(0,()=>{
      // alert(this.router.url)
      if(this.router.url == '/root/home' || this.router.url == '/auth/login'){
        App.exitApp();
      } else {
        window.history.back();
      }
    })
    this.database.getSettings().then((res) => {
      this.dataProvider.appSettings = res.data();
      console.log(this.dataProvider.appSettings);
    });
    this.user = authState(this.auth);
    this.router.navigate(['/loading']);
    this.user.subscribe({
      next:(user: any) => {
        if (user) {
          console.log(user.uid);
          this.dataProvider.LoggedInUser = true;
          this.loggedInUserData.next(user);
          const userUrl = urls.user.replace('{USER_ID}', user.uid);
          this.database.getNotifications(user.uid).subscribe((res: any) => {
            this.database.notifications = res;
            // alert('reacher2')
            this.database.notificationChanged.next(res);
            // alert('reacher3')
          });
          docData(doc(this.fs, userUrl)).subscribe((res) => {
            this.dataProvider.user = res as UserData;
            console.log(this.dataProvider.user);
            console.log(this.dataProvider.user?.phoneVerify);
            if (
              this.dataProvider.user?.phoneVerify == undefined ||
              this.dataProvider.user?.phoneVerify == false
            ) {
              this.router.navigateByUrl('auth/phone');
            }
            if (
              this.dataProvider.user?.phoneVerify == true &&
              (this.dataProvider.user?.termsCondition == undefined || this.dataProvider.user?.termsCondition == false)
            ) {
              this.router.navigateByUrl('auth/terms-condition');
            }
            if (
              this.dataProvider.user?.termsCondition == true &&
              !this.dataProvider.user?.currentAddress?.address
            ) {
              this.router.navigateByUrl('root/pick-up-address');
            }
            if (
              this.dataProvider.user?.termsCondition == true &&
              this.dataProvider.user?.currentAddress?.address &&
              this.dataProvider.LoggedInUser == true
            ) {
              this.router.navigateByUrl('root/home');
            }
            let unReadNotifications: notificationStructure[] = [];
            let showBackDrop = true;
            this.database.notificationChanged.subscribe(async (res) => {
              var value: any = {};
              for (value of res) {
                console.log('value', value);
  
                if (value.viewed != true) {
                  const isUnRead = unReadNotifications.find((existingValue) => {
                    return existingValue.id == value.id;
                  });
                  console.log(value, unReadNotifications);
                  if (isUnRead == undefined) {
                    unReadNotifications.push(value);
                    const popOver = await this.popOverController.create({
                      component: NotificationPopOverComponent,
                      componentProps: value,
                      showBackdrop: showBackDrop,
                      cssClass: 'removeShadow',
                    });
                    popOver.present();
                    showBackDrop = false;
                  }
                }
              }
            });
          });
        } else {
          console.log('logged out');
          this.router.navigate(['auth/login']);
          this.dataProvider.LoggedInUser = false;
          this.dataProvider.user = undefined;
          this.loggedInUserData.next(false);
          return;
        }
      },
      error: (err) => {
        console.log("User Error",err);
      }
    });
  }

  testAuth(){
    alert("Firing")
  }
}
