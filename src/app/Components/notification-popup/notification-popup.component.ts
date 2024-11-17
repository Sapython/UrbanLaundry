import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { DatabaseService } from 'src/services/DataBase/database.service';
import { AlertsAndNotificationsService } from 'src/services/uiService/alerts-and-notifications.service';

@Component({
  selector: 'app-notification-popup',
  templateUrl: './notification-popup.component.html',
  styleUrls: ['./notification-popup.component.scss'],
})
export class NotificationPopupComponent implements OnInit {

  constructor(private database:DatabaseService,private alertify:AlertsAndNotificationsService,public popOverController: PopoverController) { }
  @Input() id:string = ''; 
  @Input() body:string = '';
  @Output() close:EventEmitter<boolean> = new EventEmitter();

  

  ngOnInit() {}
  
}
