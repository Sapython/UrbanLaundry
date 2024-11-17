import { Component, OnInit } from '@angular/core';
import { DataProviderService } from 'src/services/Data-Provider/data-provider.service';
import { DatabaseService } from 'src/services/DataBase/database.service';
import { notificationStructure } from 'src/structures/notification.structure';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage implements OnInit {

  notificationList:any[]=[]
  constructor(public database: DatabaseService, private datProvider:DataProviderService, public dataBase:DatabaseService) { }

  ngOnInit() {
    // this.getNotifications()
    // this.deliveryIncoming()

  }

  deliveryIncoming() {
    const data:notificationStructure = {
      title: 'Pick-Up Request Received',
      body: `Hi, Your Pick up request UL3215-90 for Date: 08 April
      2023 has been registered successfully. Our executive 
      will call you shortly to confirm your preferred time for
      for pick up. `,
      action: 'pickup',
      url: '/orders',
      additionData: false,
      viewed:false,
      date: new Date(),
    }
    this.database.createNotification(this.datProvider.user?.id || '' , data)
  }

  

}
