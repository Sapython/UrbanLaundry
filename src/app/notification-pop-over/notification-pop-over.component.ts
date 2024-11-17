import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { DatabaseService } from 'src/services/DataBase/database.service';
import { AlertsAndNotificationsService } from 'src/services/uiService/alerts-and-notifications.service';

@Component({
  selector: 'app-notification-pop-over',
  templateUrl: './notification-pop-over.component.html',
  styleUrls: ['./notification-pop-over.component.scss'],
})
export class NotificationPopOverComponent implements OnInit {

  constructor(private database:DatabaseService,private alertify:AlertsAndNotificationsService,public popOverController: PopoverController) { }
  @Input() id:string = ''; 
  @Input() body:string = '';
  @Output() close:EventEmitter<boolean> = new EventEmitter();
  ngOnInit() {}
  markAsRead(){
    this.database.markNotificationAsRead(this.id).then((res)=>{
      this.alertify.presentToast('Notification marked as read')
    }).catch((error)=>{
      this.alertify.presentToast('An error occurred','error')
    })
    this.popOverController.dismiss()
  }
}
