import { Component, OnInit } from '@angular/core';
import { DocumentSnapshot } from '@angular/fire/firestore';
import { catchError, map, Observable, of } from 'rxjs';
import { DataProviderService } from 'src/services/Data-Provider/data-provider.service';
import { DatabaseService } from 'src/services/DataBase/database.service';
import { Bookings } from 'src/structures/bookings.structure';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.page.html',
  styleUrls: ['./bookings.page.scss'],
})
export class BookingsPage implements OnInit {
  bookings: ExtendedBookings[] = [];
  bookingSnapshots: DocumentSnapshot[] = [];
  constructor(
    private database: DatabaseService,
    public dataProvider: DataProviderService
  ) {}

  ngOnInit() {
    this.getBookings();
    this.bookings.forEach((element: any) => {
      this.bookings.push(element);
    });
  }

  loadMore(event:any){
    this.database.loadMoreBookingsFrom(this.bookingSnapshots[this.bookingSnapshots.length-1]).then((res) => {
      this.bookingSnapshots = res.docs;
      res.forEach((element: any) => {
        this.bookings.push({
          ...element.data(),
          id: element.id,
        });
        console.log(this.bookings);
      });
      event.target.complete();
    })
  }

  getBookings() {
    this.database.bookings().then((res) => {
      this.bookingSnapshots = res.docs;
      res.forEach((element: any) => {
        this.bookings.push({
          ...element.data(),
          id: element.id,
        });
        console.log(this.bookings);
      });
    });
  }

  async getImage(clothName: string) {
    let preloadedImage = this.dataProvider.loadedClothImages.find(
      (x) => x.name.toLowerCase() === clothName.toLowerCase()
    );
    console.log("local preloadedImage",preloadedImage);
    if (preloadedImage) {
      return preloadedImage;
    } else {
      return await this.checkImage(clothName);
    }
  }

  async checkImage(clothName: string) {
    clothName = clothName.toLowerCase();
    // return `assets/clothes/${clothName}.png`
    // check if the file exists in the folder
    // if it does, return the path
    // if it doesn't, return the default path (assets/clothes/default.png)
    try {
      console.log("fetching",`./assets/clothes/${clothName}.png`);
      let res = await fetch(`./assets/clothes/${clothName}.png`);
      if (res.ok) {
        console.log("success",res);
        this.dataProvider.loadedClothImages.push({
          name: clothName,
          image: `assets/clothes/${clothName}.png`,
        });
        return `assets/clothes/${clothName}.png`;
      } else {
        console.log("error Cannot load",res);
        this.dataProvider.loadedClothImages.push({
          name: clothName,
          image: `assets/clothes/default.png`,
        });
        return `assets/clothes/default.png`;
      }
    } catch (error) {
      console.log("error Cannot fetch",error);
      this.dataProvider.loadedClothImages.push({
        name: clothName,
        image: `assets/clothes/default.png`,
      });
      return `assets/clothes/default.png`;
    }
  }

  handleRefresh(event:any) {
    this.bookings = [];
    this.bookingSnapshots = []
    if (this.bookingSnapshots[this.bookingSnapshots.length-1]){
      this.database.loadMoreBookingsFrom(this.bookingSnapshots[this.bookingSnapshots.length-1]).then((res) => {
        this.bookingSnapshots = res.docs;
        res.forEach((element: any) => {
          this.bookings.push({
            ...element.data(),
            id: element.id,
          });
          console.log(this.bookings);
        });
        event.target.complete();
      })
    } else {
      this.bookings = [];
      this.database.bookings().then((res) => {
        this.bookingSnapshots = res.docs;
        res.forEach((element: any) => {
          this.bookings.push({
            ...element.data(),
            id: element.id,
          });
          console.log(this.bookings);
        });
        event.target.complete();
      });
    }
  }
}

export interface ExtendedBookings extends Bookings{
  id:string;
  totalQuantity:number;
}