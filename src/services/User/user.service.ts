import { Injectable } from '@angular/core';
import { Auth, authState, User } from '@angular/fire/auth';
import { addDoc, collection, doc, docData, Firestore, getDoc, getDocs, updateDoc } from '@angular/fire/firestore';
import { EMPTY, Observable, Subject, Subscription } from 'rxjs';
import { UserData } from 'src/structures/user.structure';
import { DataProviderService } from '../Data-Provider/data-provider.service';
import { urls } from '../url';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public readonly user: Observable<User | null> = EMPTY;
  
  public loggedInUserData: Subject<any> = new Subject();

  public userdata:any;
  public fetchedData:boolean = false;
  userSubscrption:Subscription = new Subscription()
  constructor(private auth: Auth, public dataProvider: DataProviderService, private fs: Firestore) {

  }

  public get getUserData(): Observable<User | null> {
    console.log(this.user)
    return this.user;
  }


  public addUser(data: UserData) {
    return addDoc(collection(this.fs, urls.users), data);
  }

  public getUser(USER_ID: any) {
    const userIDUrl = urls.user.replace('{USER_ID}', USER_ID);
    return getDoc(doc(this.fs, userIDUrl));
  }

  public getAllUsers() {
    return getDocs(collection(this.fs, '/users'));
  }

  public updateUser(USER_ID: any, data: UserData) {
    const userIDUrl = urls.user.replace('{USER_ID}', USER_ID);
    return updateDoc(doc(this.fs, userIDUrl), data)
  }

}
