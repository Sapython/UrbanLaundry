import { Component, OnInit } from '@angular/core';
import { RecaptchaVerifier } from '@angular/fire/auth';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/services/Auth/auth.service';
import { DataProviderService } from 'src/services/Data-Provider/data-provider.service';
import { AlertsAndNotificationsService } from 'src/services/uiService/alerts-and-notifications.service';
import { UserService } from 'src/services/User/user.service';
import { UserData } from 'src/structures/user.structure';


@Component({
  selector: 'app-phone',
  templateUrl: './phone.page.html',
  styleUrls: ['./phone.page.scss'],
})
export class PhonePage implements OnInit {
  verifierSet: boolean = true;
  verifier:RecaptchaVerifier;
  public phoneLoginForm: FormGroup = new FormGroup({
    phoneNumber: new FormControl(), 
  });
  constructor(private auth:AuthService, private router:Router, private dataProvider:DataProviderService, private user:UserService,private alertify:AlertsAndNotificationsService) { }

  ngOnInit() {
  }

  loginInWithPhoneNumber(){
    // console.log(this.phoneLoginForm.value.phoneNumber)
    // this.dataProvider.loading = true;
    // const data = {
    //   ...this.dataProvider.user,
    //   phone:this.phoneLoginForm.value.phoneNumber,
    //   phoneVerify:false
    // } as UserData;
    // this.user.updateUser(this.dataProvider.user?.id, data)
    // let options = {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json;charset=utf-8',
    //   },
    //   body: JSON.stringify({
    //     data: {
    //       phoneNumber: this.phoneLoginForm.value.phoneNumber,
    //     },
    //   }),
    // };
    // var url = "http://127.0.0.1:5001/urbanlaundryadmin/us-central1/checkUser";
    // // var url = "https://us-central1-urbanlaundryadmin.cloudfunctions.net/checkUser";
    // let res = fetch(
    //   url,
    //   options
    // )
    //   .then(async (res) => {
    //     if (res.status == 200) {
    //       return res.json();
    //     }
    //     throw new Error(await res.text());
    //   })
    //   .then((res) => {
    //     console.log(res);

    //   })
    //   .catch((err) => {
    //     console.log(err);
    //     this.alertify.presentToast(err.message);
    //   })
    //   .finally(() => {})
    if (this.verifierSet){
      this.verifier = this.auth.getVerifier()
      this.verifierSet = false;
    }
    this.dataProvider.loading = true;
    this.auth.signInWithPhoneNumber(this.phoneLoginForm.value.phoneNumber,this.verifier).then((res)=>{
      this.dataProvider.phoneData = res;
      this.router.navigateByUrl('auth/otpVerify');
    }).catch((err)=>{
      this.alertify.presentToast(err.message)      
    }).finally(()=>{
      this.dataProvider.loading = false;
    })
  }

}
