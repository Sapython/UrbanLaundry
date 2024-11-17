import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/services/Auth/auth.service';
import { DataProviderService } from 'src/services/Data-Provider/data-provider.service';
import { DatabaseService } from 'src/services/DataBase/database.service';
import { AlertsAndNotificationsService } from 'src/services/uiService/alerts-and-notifications.service';
import { UserService } from 'src/services/User/user.service';
import { UserData } from 'src/structures/user.structure';

@Component({
  selector: 'app-otp-verify',
  templateUrl: './otp-verify.page.html',
  styleUrls: ['./otp-verify.page.scss'],
})
export class OtpVerifyPage implements OnInit {
  public otpForm: FormGroup = new FormGroup({
    otp : new FormControl('',[Validators.required]),
  });
  constructor(
    public dataProvider: DataProviderService,
    public database:DatabaseService,
    private router: Router,
    private auth:AuthService,
    private user: UserService,
    private alertify:AlertsAndNotificationsService
  ) {}

  ngOnInit() {}

  otpVerify() {
    this.database.policy().then((res) => {
      this.dataProvider.policyData =  res.data()
    });
    this.submit();
    this.dataProvider.loading = true;
    this.dataProvider.phoneData
      .confirm(this.otpForm.value.otp)
      .then((res) => {
        console.log(res);
        this.database.checkUser(res.user.uid).then((checkRes) => {
          if(checkRes.exists()){
            const data = {
              ...this.dataProvider.user,
              phoneVerify: true,
            } as UserData;
            this.user.updateUser(res.user.uid, data);
            this.router.navigateByUrl('auth/terms-condition');
          } else {
            this.auth.setEmailUserData(res.user,{phoneVerify: true}).then((res) => {
              this.router.navigateByUrl('auth/terms-condition');
            });
          }
        })
      })
      .catch((err) => {
        console.log(err);
        this.alertify.presentToast(err.message,'error',5000);
      }).finally(()=>{
        this.dataProvider.loading = false;
      });
  }

  resendOtp(){
    
  }

  submit(){
    let otp = Object.values(this.otpForm.value).join('');
    console.log(Object.values(this.otpForm.value).join(''));
  }
}
