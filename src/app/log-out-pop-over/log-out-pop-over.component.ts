import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { AuthService } from 'src/services/Auth/auth.service';
import { DatabaseService } from 'src/services/DataBase/database.service';
import { AlertsAndNotificationsService } from 'src/services/uiService/alerts-and-notifications.service';

@Component({
  selector: 'app-log-out-pop-over',
  templateUrl: './log-out-pop-over.component.html',
  styleUrls: ['./log-out-pop-over.component.scss'],
})
export class LogOutPopOverComponent implements OnInit {

  constructor(private database:DatabaseService,private alertify:AlertsAndNotificationsService,public popOverController: PopoverController, public auth:AuthService) { }
  
  ngOnInit() {}
  

}
