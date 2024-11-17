import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { arrayUnion, increment, Timestamp } from '@firebase/firestore';
import { DataProviderService } from 'src/services/Data-Provider/data-provider.service';
import { DatabaseService } from 'src/services/DataBase/database.service';
import { Stage, StageLog } from 'src/structures/bookings.structure';

@Component({
  selector: 'app-cancel-request',
  templateUrl: './cancel-request.page.html',
  styleUrls: ['./cancel-request.page.scss'],
})
export class CancelRequestPage implements OnInit {
  reasons:{title:string,selected:boolean}[];
  bookingId:string = "";
  cancelReason:string = "";
  constructor(private activateRoute:ActivatedRoute, private databaseService:DatabaseService,private dataProvider:DataProviderService,private router:Router) {
    this.activateRoute.params.subscribe((params:any)=>{
      console.log(params);
      if (params.id){
        this.bookingId = params.id;
      }
    })
  }

  setVal(event:any){
    console.log(event);
    this.cancelReason = event.detail.value;
  }

  ngOnInit() {
    this.databaseService.reasons().then((res)=>{
      this.reasons = [];
      res.forEach((element:any) => {
        this.reasons.push({...element.data(),id:element.id,selected:false})
      })
    })
  }

  submit(){
    console.log(this.dataProvider.currentBooking);
    let stageLog:StageLog = {
      stage:'cancelled',
      date:Timestamp.now(),
      message:this.cancelReason,
      userId:'',
    }
    let stage:any = {
      log:[stageLog,...this.dataProvider.currentBooking.stage.log],
      message:this.cancelReason,
      stage:'cancelled'
    }
    this.dataProvider.loading = true;
    console.log("this.bookingId",this.bookingId);
    this.databaseService.cancelBooking(this.bookingId,{stage:stage}).then((res)=>{
      console.log(res);
      this.router.navigateByUrl('root/booking-status/'+this.bookingId);
    }).finally(()=>{
      this.dataProvider.loading = false;
    })
  }

}
