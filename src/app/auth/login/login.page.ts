import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/services/Auth/auth.service';
import { AlertsAndNotificationsService } from 'src/services/uiService/alerts-and-notifications.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  public loginForm: FormGroup = new FormGroup({
    email: new FormControl('',[Validators.required]),
    password: new FormControl('',[Validators.required]),
  });

  constructor(public auth: AuthService, private router:Router,private alertify:AlertsAndNotificationsService) { }

  ngOnInit() { }

  loginWithEmail() {
    if(this.loginForm.valid){
      this.auth.loginWithEmailPassword(this.loginForm.value.email, this.loginForm.value.password)
    }else{
      this.alertify.presentToast('Invalid Login Credentials','error')
    }
    this.loginForm.reset()
  }

  loginWithGoogle(){
    this.auth.signUpWithGoogle().then((res)=>{
      this.router.navigateByUrl('/phone')
    })
  }

}
