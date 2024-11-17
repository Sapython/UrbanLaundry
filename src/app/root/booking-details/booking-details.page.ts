import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AnimationItem } from 'lottie-web';
import { AnimationOptions } from 'ngx-lottie';
import { DataProviderService } from 'src/services/Data-Provider/data-provider.service';
import { DatabaseService } from 'src/services/DataBase/database.service';

@Component({
  selector: 'app-booking-details',
  templateUrl: './booking-details.page.html',
  styleUrls: ['./booking-details.page.scss']
})
export class BookingDetailsPage implements OnInit {
  id = this.activatedRoute.snapshot.paramMap.get('id');
  currentBookingData:any;
  animating:boolean = true;
  options: AnimationOptions = {
    path: '/assets/orderDone.json',
    autoplay:true,
    loop:false,
  };

  constructor(private database:DatabaseService, private activatedRoute:ActivatedRoute,private dataProvider:DataProviderService) {}
  ionViewWillEnter(){
    setTimeout(()=>{
      this.animating=false
    },3000)
  }
  animationCreated(animationItem: AnimationItem): void {
    console.log(animationItem);
    console.log("animationItem.totalFrames",animationItem.totalFrames);
    
  }

  animationComplete(animationItem: any): void {
    console.log("DONE",animationItem);
  }

  ngOnInit() {
    this.currentBooking();
  }
  
  currentBooking(){
    this.database.singleBooking(this.id).then((res)=>{ 
      this.currentBookingData= res.data();
      console.log(this.currentBookingData);
      this.dataProvider.currentBooking = {...this.currentBookingData, id:this.id}
      console.log("TEST",this.dataProvider.currentBooking);
    })
  }
}
