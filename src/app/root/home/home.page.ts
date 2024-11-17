import { AfterViewInit, Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { DataProviderService } from 'src/services/Data-Provider/data-provider.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/services/Auth/auth.service';
import SwiperCore, { SwiperOptions, Pagination } from 'swiper';
import { DatabaseService } from 'src/services/DataBase/database.service';
import { ActionSheetController, MenuController, NavController, PopoverController } from '@ionic/angular';
import { Geolocation, Position } from '@capacitor/geolocation';
import { LogOutPopOverComponent } from '../../log-out-pop-over/log-out-pop-over.component';
import { NotificationPopupComponent } from '../../Components/notification-popup/notification-popup.component';
import { Bookings, Service } from 'src/structures/bookings.structure';
import { Timestamp } from '@angular/fire/firestore';
import { Browser } from '@capacitor/browser';
import { AlertsAndNotificationsService } from 'src/services/uiService/alerts-and-notifications.service';
import { registerPlugin } from '@capacitor/core';
export interface WhatsappPlugin {
  openWhatsapp(options: { phone: string }): Promise<void>;
}
const PluginWhatsappService = registerPlugin<WhatsappPlugin>('Whatsapp');
export default PluginWhatsappService;
SwiperCore.use([Pagination]);

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit,AfterViewInit {
  coordinates: Position | undefined;
  bannersData: any[] = [];
  chooseService: any[] = [];
  services: any[] = [];
  constructor(
    public dataProvider: DataProviderService,
    public router: Router,
    private alertify: AlertsAndNotificationsService,
    public auth: AuthService,
    private database: DatabaseService,
    private actionSheetCtrl: ActionSheetController,
    public popoverController: PopoverController,
    private menuCtrl:MenuController
  ) {}
  currentPosition: google.maps.LatLngLiteral | undefined;
  display: any;
  center: google.maps.LatLngLiteral = {
    lat: 24,
    lng: 12,
  };
  activeOrders: Bookings[] = [];
  zoom = 18;
  markerOptions: google.maps.MarkerOptions = { draggable: false };

  ngAfterViewInit() {
    this.menuCtrl.enable(true, "main");
  }
  moveMap(event: google.maps.MapMouseEvent) {
    if (event.latLng != null) {
      this.currentPosition = event.latLng.toJSON();
    }
  }

  setHome(event: any) {
    console.log(event);
  }

  move(event: google.maps.MapMouseEvent) {
    if (event.latLng != null) this.display = event.latLng.toJSON();
  }

  config: SwiperOptions = {
    slidesPerView: 1,
    spaceBetween: 3,
    navigation: false,
    autoplay: true,
    effect:'coverflow',
    pagination: { clickable: true },
    scrollbar: { draggable: true },
  };

  async presentPopover(e: Event) {
    const popover = await this.popoverController.create({
      component: NotificationPopupComponent,
      event: e,
      translucent: false,
      cssClass: 'terms-popover',
      showBackdrop: true,
      backdropDismiss: false,
    });

    await popover.present();

    const { role } = await popover.onDidDismiss();
  }

  onSlideChange() {
    console.log('slide change');
  }

  getServices() {
    this.database.services().then((res) => {
      res.forEach((element: any) => {
        this.services.push({
          ...element.data(),
          id: element.id,
          active: false,
        });
        console.log(this.services);
      });
    });
  }

  get isServiceActive() {
    return this.services.filter((service) => service.active).length > 0;
  }

  next() {
    this.dataProvider.chooseService = JSON.parse(
      JSON.stringify(this.services.filter((service) => service.active))
    );
    this.services.forEach((service) => (service.active = false));
    console.log(this.dataProvider.chooseService);
    this.router.navigateByUrl('root/date-time/new');
    // this.navController.navigateForward('root/date-time/new');
  }

  async ngOnInit() {
    try {
      Geolocation.checkPermissions().then(async (res) => {
        if (res.location == 'granted') {
          this.setPosition();
        } else if (res.location == 'prompt') {
          Geolocation.requestPermissions().then(async (res) => {
            res.location == 'granted' ? this.setPosition() : null;
          });
        }
      }).catch((err) => {
        console.log("BITCH",err);
        this.alertify.presentToast(err.message)
      });
    } catch (error) {
      console.log("ERROR INCOMPATIBLE");
      console.log(error);
    }
    this.getServices();
    this.banners();
    this.database.getUserActiveOrders().subscribe((res) => {
      console.log('getUserActiveOrders', res);
      this.activeOrders = res as Bookings[];
    });
  }

  async canDisMiss() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Are you sure?',
      buttons: [
        {
          text: 'Yes',
          role: 'confirm',
        },
        {
          text: 'No',
          role: 'cancel',
        },
      ],
    });

    actionSheet.present();

    const { role } = await actionSheet.onWillDismiss();
    if (role === 'confirm') {
      this.auth.logout();
    }
    console.log(role);

    return role === 'confirm';
  }

  banners() {
    this.database.banners().then((res) => {
      res.forEach((element: any) => {
        this.bannersData.push({
          ...element.data(),
          id: element.id,
        });
        console.log(this.bannersData);
      });
    });
  }

  async setPosition() {
    try {
      this.coordinates = await Geolocation.getCurrentPosition();
      this.currentPosition = {
        lat: this.coordinates.coords.latitude,
        lng: this.coordinates.coords.longitude,
      };
      this.center = this.currentPosition;
    } catch (error) {
      console.log(error);
    }
  }

  async actionOnBanner(banner: Banner) {
    if (banner.bannerUrlType == 'Url') {
      if (banner.bannerUrl.startsWith('https://urbanlaundry.co/')) {
        await Browser.open({ url: banner.bannerUrl });
      } else {
        this.alertify.presentToast('Invalid Action');
      }
    }
  }

  showBanner(startDate: Timestamp, endDate: Timestamp) {
    let currentDate = new Date();
    let start = startDate.toDate();
    let end = endDate.toDate();
    return currentDate >= start && currentDate <= end;
  }

  openWhatsapp() {
    let phone = '+91' + this.dataProvider.appSettings?.contact?.whatsapp;
    console.log('phone', phone);
    PluginWhatsappService.openWhatsapp({ phone: phone });
  }
}

@Pipe({ name: 'serviceName' })
export class ServiceNamePipe implements PipeTransform {
  transform(value: Service[]): string {
    return value.map((service) => service.name).join(', ');
  }
}
export interface Banner {
  title: string;
  bannerUrlType: 'Url' | 'App';
  bannerUrl: string;
  bannerImage: string;
  startDate: Timestamp;
  endDate: Timestamp;
  enabled: boolean;
}
