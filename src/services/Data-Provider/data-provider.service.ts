import { Injectable } from '@angular/core';
import { ConfirmationResult } from '@angular/fire/auth';
import { Bookings, Counters } from 'src/structures/bookings.structure';
import { UserData } from 'src/structures/user.structure';


@Injectable({
  providedIn: 'root'
})
export class DataProviderService {

  public LoggedInUser :boolean;
  public policyData:any;
  public user:UserData | undefined;
  public loading:boolean = false;
  public chooseService:any[]=[];
  public currentBooking:Bookings;
  public counters:Counters|undefined;
  public signUp:any;
  public notification:any[] = [];
  public phoneData : ConfirmationResult;
  public appSettings:any;
  public loadedClothImages:{name:string,image:string}[] = [];
  constructor() { }
}
