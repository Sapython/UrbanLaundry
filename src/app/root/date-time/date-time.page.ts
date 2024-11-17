import { Component, Input, OnInit } from '@angular/core';
import { SwiperOptions } from 'swiper';
import { DataProviderService } from 'src/services/Data-Provider/data-provider.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DatabaseService } from 'src/services/DataBase/database.service';
import { AlertsAndNotificationsService } from 'src/services/uiService/alerts-and-notifications.service';
import { Bookings } from 'src/structures/bookings.structure';
import { UserData } from 'src/structures/user.structure';
import { Timestamp } from '@angular/fire/firestore';

@Component({
  selector: 'app-date-time',
  templateUrl: './date-time.page.html',
  styleUrls: ['./date-time.page.scss'],
})
export class DateTimePage implements OnInit {
  todayDate = new Date();

  @Input() value: String = "custom";

  dates: any[] = [];
  times: {start:Date,end:Date,checked?:boolean}[] = [];
  filteredTimes: {start:Date,end:Date,checked?:boolean}[] = [];
  chooseDate: any;
  chooseTime: any;
  currentService: any;
  mode:string|'new'='new';
  public SecondDate: any = new Date().setHours(this.todayDate.getHours() + 2);
  constructor(
    public dataProvider: DataProviderService,
    public router: Router,
    private database: DatabaseService,
    private alertify: AlertsAndNotificationsService,
    private activatedRoute:ActivatedRoute
  ) {
    this.activatedRoute.params.subscribe((params)=>{
      console.log(params);
      if(params["id"]=="new"){
        this.mode='new'
      } else {
        this.mode=params["id"]
      }
    })
  }

  ngOnInit() {
    // let view = new Video()
    function convertTimeStringToDateObject(timeString: string) {
      // convert 09:00 PM to Date object with current date
      const date = new Date();
      let time = timeString.split(' ')[0]
      let amPm = timeString.split(' ')[1]
      const [hours, minutes] = time.split(':');
      date.setHours(parseInt(hours));
      if (amPm == 'PM') {
        date.setHours(date.getHours() + 12);
      }
      date.setMinutes(parseInt(minutes));
      console.log("Parsed",date);
      return date;
    }
    this.dates = this.generateDates(new Date(), 7);
    // this.times = this.generateTime(new Date(), 8, 1);
    console.log("BITCH",this.dataProvider.appSettings.slots);
    
    this.times = this.dataProvider.appSettings.slots.map((slot: any) => {
      return {
        start: convertTimeStringToDateObject(slot.startTime),
        end: convertTimeStringToDateObject(slot.endTime),
      }
    })
    // filter time in past
    // this.times = this.times.filter((stage)=>{
    //   console.log(stage.end,new Date());
    //   return stage.end.getHours() > (new Date()).getHours();
    // })
    console.log(this.dataProvider.chooseService)
    this.currentService = this.dataProvider.chooseService[0]
  }

  switchedTab(event: any) {
    console.log(event);
    // set pricingTableClothes
    // this.dataProvider.chooseService.forEach((service:any) => {

    // })
    for (const service of this.dataProvider.chooseService) {
      if (service.name == event.detail.value) {
        this.currentService = service
        break
      }
    }
  }

  generateDates(today: Date, count: number) {
    if (today.getHours() >= 21 && today.getSeconds() > 0) {
      today.setDate(today.getDate() + 1);
    }
    const dates: any[] = [
      // new Date(today.getTime()),
      {
        date: new Date(today.getTime()),
        checked: false
      }
    ];
    for (let index = 0; index < count; index++) {
      today.setDate(today.getDate() + 1);
      dates.push(
        {
          date: new Date(today.getTime()),
          checked: false
        }
      );
      console.log(today);
    }
    return dates;
  }

  generateTime(today: Date, count: number, hourGap: number) {
    if (today.getHours() >= 21 && today.getSeconds() > 0) {
      today.setTime(today.getTime() + hourGap * 60 * 60 * 1000);
    }
    const time: any[] = [
      {
        start: new Date(today.getTime()),
        checked: false,
        end: new Date(today.setTime(today.getTime() + hourGap * 60 * 60 * 1000)),
      }
    ];
    for (let index = 0; index < count; index++) {
      today.setTime(today.getTime() + hourGap * 60 * 60 * 1000);
      time.push({
        start: new Date(today.getTime()),
        checked: false,
        end: new Date(today.setTime(today.getTime() + hourGap * 60 * 60 * 1000)),
      });
      console.log(today);
    }
    return time;
  }

  config: SwiperOptions = {
    slidesPerView: 3,
    spaceBetween: 15,
    navigation: false,
    autoplay: true,
    scrollbar: { draggable: true },
  };

  time: SwiperOptions = {
    slidesPerView: 2,
    spaceBetween: 15,
    navigation: false,
    autoplay: true,
    scrollbar: { draggable: true },
  };

  onSlideChange() {
    console.log('slide change');
  }

  generateId() {
    return Math.floor(Math.random() * 100000);
  }

  booking() {
    if (this.chooseDate == null || this.chooseTime == null) {
      this.alertify.presentToast('Please select date and time');
      return;
    }
    if (this.dataProvider.user){
      if(this.mode=='new'){
        if(!this.dataProvider.user.currentAddress){
          this.alertify.presentToast('Please add your address','error');
          return
        }
        const booking: Bookings = {
          slot: {
            date: this.chooseDate.date,
            startTime: this.chooseTime.start,
            endTime: this.chooseTime.end,
          },
          otp: this.generateId().toString(),
          stage: {
            stage: "pending",
            message: '',
            log: [],
          },
          pickupAgentId: '',
          deliveryAgentId: '',
          userId: this.dataProvider.user.id || '',
          billingDetail: {
            total: 0,
            couponCodeId: '',
            discount: 0,
            tax: 0,
            grandTotal: 0,
          },
          services: this.dataProvider.chooseService,
          userDetails:{
            userId: this.dataProvider.user.id || '',
            displayId: this.dataProvider.user.customUid,
            displayName: this.dataProvider.user.displayName,
            deliveryAddress:this.dataProvider.user.currentAddress!,
            phone: this.dataProvider.user.phone,
            email: this.dataProvider.user.email,
            photoURL: this.dataProvider.user.photoURL,
            pickupAddress: this.dataProvider.user.currentAddress!,
          },
          activeClothes: null || [],
          totalWeight: 0,
          recount: false,
          createdAt:Timestamp.fromDate(new Date()),
        };
        console.log(booking);
        this.dataProvider.currentBooking = booking;
        this.dataProvider.loading = true;
        this.database.createBooking(booking).then((res) => {
          this.router.navigateByUrl('root/booking-details/' + res.id);
        }).finally(() => {
          this.dataProvider.loading = false;
          this.dataProvider.chooseService = [];
          this.alertify.presentToast('Booking created successfully');
        }); 
      } else {
        const booking:any = {
          slot: {
            date: this.chooseDate.date,
            startTime: this.chooseTime.start,
            endTime: this.chooseTime.end,
          },
        };
        console.log(booking);
        this.dataProvider.loading = true;
        this.database.updateBooking(this.mode,booking).then((res) => {
          this.router.navigateByUrl('root/booking-details/' + this.mode);
        }).finally(() => {
          this.dataProvider.loading = false;
          this.dataProvider.chooseService = [];
          this.alertify.presentToast('Booking updated successfully');
        }); 
      }
    }
  }

  setTime(date: { start: Date, end: Date, checked?: boolean }) {
    date.checked = !date.checked;
    this.times.forEach((time) => {
      if (time.start != date.start) {
        time.checked = false;
      }
    })
    if (date.checked) {
      this.chooseTime = date;
    } else {
      this.chooseTime = null;
    }
    console.log(this.dates)
  }

  setDate(date: { date: Date, checked: boolean }) {
    date.checked = !date.checked;
    this.dates.forEach((dates) => {
      if (dates.date != date.date) {
        dates.checked = false;
      }
    })
    if (date.checked) {
      this.chooseDate = date;
    } else {
      this.chooseDate = null;
    }
    // console.log(this.times)
    this.filteredTimes = []
    this.filteredTimes = this.times.slice();
    // console.log(date.date.toLocaleString());
    // // date.date.setTime(0)
    // date.date.setHours((new Date().getHours()));
    // console.log(date.date.toLocaleString());
    // // filter time according to date and slot endTime should be greater than slot startTime 
    if (date.date < new Date()) {
      this.filteredTimes = this.filteredTimes.filter((time) => {
        console.log(time.end,time.end.getTime(),date.date,date.date.getTime(),time.end.getTime() >= date.date.getTime());
        return time.end.getTime() >= date.date.getTime();
      })
    } else {
      this.filteredTimes = this.times.slice();
    }
  }



}
