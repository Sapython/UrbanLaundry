import { Injectable } from '@angular/core';
import { addDoc, collection, collectionChanges, collectionData, doc, docData, DocumentData, Firestore, getDoc, getDocs, increment, limit, onSnapshot, orderBy, query, setDoc, startAt, updateDoc, where } from '@angular/fire/firestore';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from '@angular/fire/storage';
import { Subject,BehaviorSubject  } from 'rxjs';
import { Bookings, Counters } from 'src/structures/bookings.structure';
import { notificationStructure } from 'src/structures/notification.structure';
import { DataProviderService } from '../Data-Provider/data-provider.service';
import { urls } from '../url';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  
  public notifications: notificationStructure[] = [];
  notificationChanged: BehaviorSubject<notificationStructure[]> = new BehaviorSubject<notificationStructure[]>([]);
  storage = getStorage();
  constructor(private fs: Firestore, public dataProvider: DataProviderService) {
    docData(doc(this.fs, 'sitedata/counters')).subscribe((res)=>{
      this.dataProvider.counters = res as Counters;
    })
  }

  async upload(
    path: string,
    file: File | ArrayBuffer | Blob | Uint8Array
  ): Promise<any> {

    if (file) {
      try {
        const storageRef = ref(this.storage, path);
        const task = uploadBytesResumable(storageRef, file);
        await task;
        const url = await getDownloadURL(storageRef);
        return url;
      } catch (e: any) {
        console.error(e);
        return e;
      }
    } else {
      // handle invalid file
      return false;
    }
  }

  async createBooking(data: Bookings) { 
    updateDoc(doc(this.fs,'sitedata/counters'), {bookings: increment(1)});
    let orderId = 'ORD'+this.dataProvider.counters!.bookings
    let res = await setDoc(doc(this.fs, urls.bookings+'/'+orderId), data);
    return {id:orderId};
  }

  singleBooking(BOOKING_ID: any) {
    const bookingUrl = urls.booking.replace('{BOOKING_ID}', BOOKING_ID);
    return getDoc(doc(this.fs, bookingUrl));
  }

  singleBookingSubscription(BOOKING_ID: any) {
    const bookingUrl = urls.booking.replace('{BOOKING_ID}', BOOKING_ID);
    return docData(doc(this.fs, bookingUrl),{idField:'id'});
  }

  updateBooking(BOOKING_ID: string, data:any) {
    const bookingUrl = urls.booking.replace('{BOOKING_ID}', BOOKING_ID);
    return setDoc(doc(this.fs, bookingUrl), data,{merge:true});
  }

  bookings() {
    return getDocs(query(collection(this.fs, urls.bookings),where('userId','==',this.dataProvider.user!.id),orderBy('createdAt','desc'),limit(6)));
  }

  loadMoreBookingsFrom(index:DocumentData){
    return getDocs(query(collection(this.fs, urls.bookings),where('userId','==',this.dataProvider.user!.id),orderBy('createdAt','desc'),limit(6),startAt(index)));
  }

  contactUs(data: any) {
    return addDoc(collection(this.fs, urls.contactUs), data);
  }

  createNotification( userId:string, data: notificationStructure) {
    const notificationUrl = urls.notification.replace('{USER_ID}', userId);
    return addDoc(collection(this.fs, notificationUrl), data);
  }

  getNotifications(userId:string) {
    const notificationUrl = urls.notification.replace('{USER_ID}', userId);
    return collectionData(collection(this.fs, notificationUrl), { idField: 'id' });
  }

  markNotificationAsRead(id: any) {
    return updateDoc(doc(this.fs,urls.notification.replace('{USER_ID}', this.dataProvider.user?.id || '')+'/'+id),{viewed:true})
  }

  getCurrentDelivery(){
    return collectionData(query(collection(this.fs, urls.bookings), where('deliveryAgentId', '==', this.dataProvider.user?.id || '')), { idField: 'id' })
  }

  services(){
    return getDocs(collection(this.fs, urls.services) )
  }

  getSettings(){
    return getDoc(doc(this.fs, urls.settings))
  }

  getAreas(){
    return getDocs(collection(this.fs, urls.areas))
  }

  policy() {
    return getDoc(doc(this.fs, urls.policy));
  }

  getClothImage(clothName:string){
    return collectionData(query(collection(this.fs, urls.cloths), where('name', '==', clothName)), { idField: 'id' })
  }

  banners(){
    return getDocs(collection(this.fs, urls.banners))
  }

  reasons(){
    return getDocs(collection(this.fs, urls.reasons))
  }
  
  getUserActiveOrders(){
    console.log("fetching for",this.dataProvider.user?.id || '');
    return collectionData(query(collection(this.fs, urls.bookings), where('userId', '==', this.dataProvider.user?.id || ''), where('stage.stage', 'not-in', ['deliveryCompleted','cancelled'])), { idField: 'id' })
  }

  cancelBooking(bookingId: any, data:any) {
    console.log("urls.bookings+'/'+bookingId",urls.bookings+'/'+bookingId);
    return updateDoc(doc(this.fs,urls.bookings+'/'+bookingId),data)
  }

  checkUser(uid:string){
    return getDoc(doc(this.fs,urls.users+uid))
  }
}

