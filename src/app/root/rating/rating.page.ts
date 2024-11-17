import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DataProviderService } from 'src/services/Data-Provider/data-provider.service';
import { DatabaseService } from 'src/services/DataBase/database.service';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.page.html',
  styleUrls: ['./rating.page.scss'],
})
export class RatingPage implements OnInit {

  public loginForm: FormGroup = new FormGroup({
    reason: new FormControl(''),
    password: new FormControl(''),
  });

  reasonsList:any[]=[];
  constructor(private dataProvider:DataProviderService , private database:DatabaseService) { }

  ngOnInit() {}

  reasons(){
    this.database.reasons().then((res:any)=>{
      res.forEach((element: any) => {
        this.reasonsList.push({
          ...element.data(),
          id: element.id,
          active: false
        });
        console.log(this.reasonsList)
      });
    })
  }

}
