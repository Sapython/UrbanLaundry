import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { DatabaseService } from 'src/services/DataBase/database.service';
import { Bookings, Service } from 'src/structures/bookings.structure';

@Component({
  selector: 'app-booking-card',
  templateUrl: './booking-card.component.html',
  styleUrls: ['./booking-card.component.scss'],
})
export class BookingCardComponent implements OnInit {
  @Input() booking:Bookings;
  @Input() noRoute:boolean = false;
  quantity:number = 0;
  // booking:any
  constructor(private database:DatabaseService,private navController:NavController) { }

  ngOnInit() {
    console.log(this.booking)
    if(this.booking){
      // this.booking = this.getClothes(this.booking.services);
      this.getClothQuantity();
    }
    
  }

  getClothQuantity(){
    // console.log(this.booking.activeClothes);
    if(this.booking.activeClothes && this.booking.activeClothes.length > 0){
      this.quantity = this.booking.activeClothes.reduce((total:number, item:any )=>{
        return total + item.quantity;
      },0)
    }
    console.log( this.quantity);
  }

  wordsToSentence(services:Service[]){
    let words = services.map((service)=>service.name);
    // join words by command and last word by and
    return words.slice(0, -1).join(', ') + (words.length > 1 ? ' and ' : '') + words.slice(-1);
  }

  getClothes(services:Service[]){
    let clothes = services.map((service)=>service.clothes).map((clothes)=>clothes.map((cloth)=>cloth.name))
    let result:{cloth:string,quantity:number}[] = [];
    // console.log("clothes",clothes);
    clothes.forEach((cloth)=>{
      cloth.forEach((cloth)=>{
        let index = result.findIndex((x)=>x.cloth===cloth);
        if(index===-1){
          result.push({cloth:cloth,quantity:1});
        }else{
          result[index].quantity++;
        }
      })
    })
    return result;
  }


  getTotalWeight(services:Service[]){
    let totalWeight = 0;
    services.forEach((service)=>{
      if (service.type==true){
        totalWeight += service.clothes.map((cloth)=>cloth.cost).reduce((a,b)=>a+b,0);
      }
    })
  }

  toUrl(url:string){
    this.navController.navigateForward(url);
  }

  breakWordOnCase(text:string){
    return text.replace(/([A-Z])/g, ' $1').trim();
  }
}



export interface ExtendedBookings extends Bookings{
  id:string;
}