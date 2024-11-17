import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataProviderService } from 'src/services/Data-Provider/data-provider.service';
import { DatabaseService } from 'src/services/DataBase/database.service';
import { UserService } from 'src/services/User/user.service';
import { UserData } from 'src/structures/user.structure';
import { Geolocation, Position } from '@capacitor/geolocation';
import { AlertsAndNotificationsService } from 'src/services/uiService/alerts-and-notifications.service';
import { Address } from 'src/structures/bookings.structure';

@Component({
  selector: 'app-pick-up-address',
  templateUrl: './pick-up-address.page.html',
  styleUrls: ['./pick-up-address.page.scss'],
})
export class PickUpAddressPage implements OnInit {
  areas: any[] = []
  locationNotFound:boolean = false;
  public addressForm: FormGroup = new FormGroup({
    displayName: new FormControl('',Validators.required),
    address: new FormControl('',Validators.required),
    nearBy: new FormControl(''),
    pincode: new FormControl('',Validators.required),
    area: new FormControl('',Validators.required),
  });
  coordinates:Position;
  constructor(private user: UserService, public dataProvider: DataProviderService, private databaseService: DatabaseService, private router: Router,private alertify:AlertsAndNotificationsService) { }
  currentPosition:google.maps.LatLngLiteral;
  center: google.maps.LatLngLiteral;
  zoom = 18;
  mapOptions: google.maps.MapOptions = {
    zoom: 18,
    mapTypeId: 'roadmap',
    disableDefaultUI: true,
  }
  markerOptions: google.maps.MarkerOptions = {draggable: false};
  centerMarkerOptions: google.maps.MarkerOptions = {draggable: false, icon: './assets/circle.png',};
  moveMap(event: google.maps.MapMouseEvent) {
    // console.log(event);
    if (event.latLng != null) {
      this.currentPosition = event.latLng.toJSON();
    }
  }
  async ngOnInit() {
    this.databaseService.getAreas().then((res: any) => {
      res.forEach((element: any) => {
        this.areas.push({
          ...element.data(),
          id: element.id,
        });
        console.log(this.areas);
      });
    })
    this.getLocation().then((res)=>{
      console.log(res);
    }).catch((err)=>{
      this.alertify.presentToast("Location Not Found. Please Enable GPS.",'error');
      this.locationNotFound = true;
    })
    console.log(this.dataProvider.user)
    const data = {
      ...this.dataProvider.user?.currentAddress,
      area: this.dataProvider.user?.currentAddress?.area?.id || ''
    }
    this.dataProvider.user?.currentAddress
    console.log("data", data);
    this.addressForm.patchValue(data)
    
  }

  async getLocation(){
    this.coordinates = await Geolocation.getCurrentPosition();
    this.currentPosition = {
      lat: this.coordinates.coords.latitude,
      lng: this.coordinates.coords.longitude,
    }
    this.center = this.currentPosition;
  }

  pickupAddress() {
    if(!this.coordinates?.coords){
      this.alertify.presentToast("Location Not Found. Please Enable GPS.",'error');
    }
    if (this.addressForm.invalid) {
      this.alertify.presentToast("Please fill all the fields.",'error');
      return;
    }
    this.dataProvider.loading = true;
    let name = this.addressForm.value.displayName;
    // remove display name from address
    delete this.addressForm.value.displayName;
    const data:UserData = {
      displayName: name,
      currentAddress: {
        ...this.addressForm.value,
        latitude: this.currentPosition?.lat || null,
        longitude: this.currentPosition?.lng || null,
        area: this.areas.find((area: any) => area.id == this.addressForm.value.area)
      }
    } as UserData
    console.log(data, this.addressForm.value)
    this.user.updateUser(this.dataProvider.user?.id, data).then((res) => {
      this.router.navigateByUrl('root/home')
    }).finally(()=>{
      this.dataProvider.loading = false;
    })
  }

  information(){
    this.alertify.presentToast("Red marker is your new location. Blue circle is your currrent location. Click anywhere to set new location",'info',10000)
  }
}
