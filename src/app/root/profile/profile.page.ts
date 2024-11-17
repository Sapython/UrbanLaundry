import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/services/Auth/auth.service';
import { DataProviderService } from 'src/services/Data-Provider/data-provider.service';
import { DatabaseService } from 'src/services/DataBase/database.service';
import { AlertsAndNotificationsService } from 'src/services/uiService/alerts-and-notifications.service';
import { UserService } from 'src/services/User/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  public url: any;
  public file: any;
  public change: boolean = false;
  addressForm: FormGroup = new FormGroup({
    address: new FormControl(''),
  });
  editMode: boolean = false;
  public profileForm: FormGroup = new FormGroup({
    displayName: new FormControl(''),
    phone: new FormControl(''),
    currentAddress: this.addressForm,
    email: new FormControl(''),
    gender: new FormControl(''),
    phoneNumber: new FormControl(''),
    photoURL: new FormControl(''),
    dateOfBirth: new FormControl(''),
  });

  constructor(
    private database: DatabaseService,
    public dataProvider: DataProviderService,
    private user: UserService,
    private alertify: AlertsAndNotificationsService,
    private router: Router,
    private auth: AuthService
  ) {}

  ngOnInit() {
    console.log(this.dataProvider.user);
    if (this.dataProvider.user) {
      this.profileForm.patchValue(this.dataProvider.user);
      console.log(this.profileForm.value);
    }
    this.profileForm.valueChanges.subscribe((value) => {
      console.log(value);
      this.change = true;
    });
  }

  async uploadFile(files: FileList | null) {
    if (files) {
      const file = files[0];
      const url = await this.database.upload('users/' + file.name, file);
      this.url = url;
      console.log(this.url);
    }
  }

  async profile() {
    this.dataProvider.loading = true;
    try {
      // console.log(this.file.target.files[0]);
      await this.uploadFile(this.file?.target?.files);
      if (this.url) {
        const profile = {
          ...this.profileForm.value,
          photoURL: this.url,
          dateOfBirth:new Date(this.profileForm.value.dateOfBirth)
        };
        console.log(profile);
        await this.user.updateUser(this.dataProvider.user?.id, profile);
        this.editMode = false;
      } else {
        const profile = {
          ...this.profileForm.value,
          photoURL: this.dataProvider.user?.photoURL,
          dateOfBirth:new Date(this.profileForm.value.dateOfBirth)
        };
        console.log(profile);
        await this.user.updateUser(this.dataProvider.user?.id, profile);
        this.editMode = false;
      }
      this.editMode = false;
    } catch (error) {
      this.alertify.presentToast('Some error occurred', 'error');
    } finally {
      this.dataProvider.loading = false;
    }
  }

  resetPassword() {
    if (confirm('Are you sure you want to reset your password?')) {
      if (this.dataProvider.user?.email) {
        this.auth.resetPassword(this.dataProvider.user!.email);
      } else {
        this.alertify.presentToast('Email not found', 'error');
      }
    } else {
      this.alertify.presentToast('Password reset cancelled', 'info');
    }
  }
}
