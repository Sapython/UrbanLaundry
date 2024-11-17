import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser'
import { Router } from '@angular/router';
import { DataProviderService } from 'src/services/Data-Provider/data-provider.service';
import { DatabaseService } from 'src/services/DataBase/database.service';
import { AlertsAndNotificationsService } from 'src/services/uiService/alerts-and-notifications.service';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.page.html',
  styleUrls: ['./contact-us.page.scss'],
})
export class ContactUsPage implements OnInit {

  files: any = [];
  imageAcceptedFiles:string[] = [
    'image/jpeg',
    'image/png'
  ]
  contactUsForm:FormGroup = new FormGroup({
    type: new FormControl('',[Validators.required]),
    description: new FormControl('',[Validators.required]),
    image: new FormControl([]),
  })
  urls:string[] = []
  constructor(private database:DatabaseService,public dataProvider:DataProviderService,private router:Router,private alertify:AlertsAndNotificationsService) { }

  ngOnInit() {
  }

  async uploadFile(files: FileList | null) {
    if (files) {
      let file:any = {}
      for(file of Array.from(files)){
        const url = await this.database.upload('contactUs/'+(new Date()).toLocaleTimeString() + file.name, file);
        console.log(url);
        this.urls.push(url);
      }
    }
  }


  async contactUs() {
    this.dataProvider.loading = true;
    // console.log(this.file.target.files[0]);
    try {
       if (this.files.length > 0){
         await this.uploadFile(this.files);
       }
      if (this.files.length > 0 && this.urls.length > 0) {
        var contactUs = {
          ...this.contactUsForm.value,
          photoURLs: this.urls,
        }
      } else {
        var contactUs = {
          ...this.contactUsForm.value,
        }
      }
      console.log(contactUs)
      this.database.contactUs(contactUs).then((res) => {
        this.alertify.presentToast('Your message has been sent successfully to admin.');
        this.router.navigateByUrl('root/home');
      }).catch((err)=>{
        console.log(err);
        this.alertify.presentToast('Something went wrong');
      }).finally(() => {
        this.dataProvider.loading = false;
      });
    } catch (error) {
      this.dataProvider.loading = false;
    }
  }


  onSelect(event:any) {
    console.log(event);
    this.files.push(...event.addedFiles);
  }
  
  onRemove(event:any) {
    console.log(event);
    this.files.splice(this.files.indexOf(event), 1);
  }


}