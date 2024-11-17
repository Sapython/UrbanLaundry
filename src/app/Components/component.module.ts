import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { IonicModule } from '@ionic/angular';
import { DropzoneDirective } from './dropzone/drop-zone.directive';
import { FooterComponent } from './footer/footer.component';
import { LoadingComponent } from './loading/loading.component';
import { NotificationPopupComponent } from './notification-popup/notification-popup.component';




@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    DropzoneDirective,
    LoadingComponent,
    NotificationPopupComponent
  ],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports:[
    HeaderComponent,
    FooterComponent,
    DropzoneDirective,
    LoadingComponent,
    NotificationPopupComponent
  ]
})
export class ComponentModule { }
