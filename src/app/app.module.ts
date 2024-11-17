import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy, iosTransitionAnimation } from '@ionic/angular';
import { SwiperModule } from 'swiper/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import {
  provideAnalytics,
  getAnalytics,
  ScreenTrackingService,
  UserTrackingService,
} from '@angular/fire/analytics';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideFunctions, getFunctions, connectFunctionsEmulator } from '@angular/fire/functions';
import { providePerformance, getPerformance } from '@angular/fire/performance';
import { provideStorage, getStorage } from '@angular/fire/storage';
import { AlertsAndNotificationsService } from 'src/services/uiService/alerts-and-notifications.service';
import { DatabaseService } from 'src/services/DataBase/database.service';
import { UserService } from 'src/services/User/user.service';
import { DataProviderService } from 'src/services/Data-Provider/data-provider.service';
import { NotificationPopOverComponent } from './notification-pop-over/notification-pop-over.component';
import { LogOutPopOverComponent } from './log-out-pop-over/log-out-pop-over.component';
import { GoogleMapsModule } from '@angular/google-maps';
import { LottieModule } from 'ngx-lottie';
import player from 'lottie-web';

// Note we need a separate function as it's required
// by the AOT compiler.
export function playerFactory() {
  return player;
}
@NgModule({
  declarations: [AppComponent,NotificationPopOverComponent, LogOutPopOverComponent],
  imports: [
    BrowserModule,
    SwiperModule,
    IonicModule.forRoot({navAnimation:iosTransitionAnimation}),
    AppRoutingModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAnalytics(() => getAnalytics()),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    providePerformance(() => getPerformance()),
    provideStorage(() => getStorage()),
    provideFunctions(() => {
      let functions = getFunctions();
      connectFunctionsEmulator(functions, 'localhost', 5001);
      return functions;
    }),
    GoogleMapsModule,
    LottieModule.forRoot({ player: playerFactory })
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    ScreenTrackingService,
    UserTrackingService,
    AlertsAndNotificationsService,
    DatabaseService,
    UserService,
    DataProviderService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
