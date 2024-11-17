import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { DataProviderService } from 'src/services/Data-Provider/data-provider.service';
import { DatabaseService } from 'src/services/DataBase/database.service';
import { UserService } from 'src/services/User/user.service';
import { Bookings } from 'src/structures/bookings.structure';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Timestamp } from '@angular/fire/firestore';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { registerPlugin } from '@capacitor/core';
export interface FileWRiter {
  writeFile(options: { data: string; name: string }): Promise<any>;
}
const PluginFileWriterService = registerPlugin<FileWRiter>('FileWriter');
export default PluginFileWriterService;
var toProperCase = function (text: string) {
  return text.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};
import { Browser } from '@capacitor/browser';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-booking-status',
  templateUrl: './booking-status.page.html',
  styleUrls: ['./booking-status.page.scss'],
})
export class BookingStatusPage implements OnInit {
  id: any;
  currentBookingData: Bookings;
  agent: any;
  deliveryBoy: any;
  bookingDataSubscription:Subscription = Subscription.EMPTY;
  bookingStatuses = [
    'pending',
    'pickupAssigned',
    'pickupStarted',
    'pickupReceived',
    'pickupCompleted',
    'washInProgress',
    'washCompleted',
    'deliveryAssigned',
    'outForDelivery',
    'deliveryCompleted',
    'cancelled',
  ];

  constructor(
    private database: DatabaseService,
    private activatedRoute: ActivatedRoute,
    public dataProvider: DataProviderService,
    private user: UserService
  ) {}

  ngOnInit() {
    console.log('this.currentBookingData', this.currentBookingData);
    this.activatedRoute.params.subscribe((params: Params) => {
      this.id = params['id'];
      console.log(this.id);
      if (this.id != undefined) {
        this.currentBooking();
      }
    });
  }

  currentBooking() {
    this.bookingDataSubscription = this.database.singleBookingSubscription(this.id).subscribe((res:any) => {
      console.log(res);
      this.currentBookingData = res;
      this.dataProvider.currentBooking = res;
      console.log(this.currentBookingData);
      if (this.currentBookingData.pickupAgentId.length) {
        this.getAgent();
      }
      if (this.currentBookingData.deliveryAgentId.length) {
        this.deliveryAgent();
      }
    });
  }

  isModalOpen = false;

  recount(recount: boolean) {
    console.log(recount);
    if (recount == true) {
      const data: Bookings = {
        slot: this.currentBookingData.slot,
        otp: this.currentBookingData.otp,
        stage: this.currentBookingData.stage,
        pickupAgentId: this.currentBookingData.pickupAgentId,
        deliveryAgentId: this.currentBookingData.deliveryAgentId,
        userId: this.currentBookingData.userId,
        billingDetail: this.currentBookingData.billingDetail,
        services: this.currentBookingData.services,
        userDetails: this.currentBookingData.userDetails,
        totalWeight: this.currentBookingData.totalWeight,
        activeClothes: this.currentBookingData.activeClothes,
        recount: true,
        createdAt: this.currentBookingData.createdAt,
      };
      this.database.updateBooking(this.id, data);
      console.log(data);
    }
    if (recount == false) {
      const data: Bookings = {
        slot: this.currentBookingData.slot,
        otp: this.currentBookingData.otp,
        stage: {
          stage: 'pickupReceived',
          log: [],
          message: '',
        },
        pickupAgentId: this.currentBookingData.pickupAgentId,
        deliveryAgentId: this.currentBookingData.deliveryAgentId,
        userId: this.currentBookingData.userId,
        billingDetail: this.currentBookingData.billingDetail,
        services: this.currentBookingData.services,
        userDetails: this.currentBookingData.userDetails,
        totalWeight: this.currentBookingData.totalWeight,
        activeClothes: this.currentBookingData.activeClothes,
        recount: false,
        createdAt: Timestamp.fromDate(new Date()),
      };
      this.database.updateBooking(this.id, data);
      console.log(data);
    }
  }

  getAgent() {
    this.user
      .getUser(this.currentBookingData?.pickupAgentId)
      .then((res: any) => {
        console.log(res.data());
        this.agent = res.data();
      });
  }

  deliveryAgent() {
    this.user
      .getUser(this.currentBookingData?.deliveryAgentId)
      .then((res: any) => {
        console.log(res.data());
        this.deliveryBoy = res.data();
      });
  }

  getTotal(): number {
    let total = 0;
    this.currentBookingData.services.forEach((service) => {
      service.activeClothes.forEach((cloth) => {
        total = total + cloth.cost * cloth.count;
      });
    });
    return total;
  }

  public async downloadInvoice() {
    console.log('downloadInvoice', this.currentBookingData);
    // calculate total
    this.dataProvider.loading = true;
    const doc = new jsPDF({ filters: ['ASCIIHexEncode'] });
    autoTable(doc, {
      body: [
        [
          {
            content: 'Urban Laundry',
            styles: {
              halign: 'left',
              fontSize: 20,
              textColor: '#ffffff',
            },
          },
          {
            content: 'Invoice',
            styles: {
              halign: 'right',
              fontSize: 20,
              textColor: '#ffffff',
            },
          },
        ],
      ],
      theme: 'plain',
      styles: {
        fillColor: '#579540',
      },
    });
    autoTable(doc, {
      body: [
        [
          {
            content: 'GSTN: 09IXVPK0011F1ZE',
            styles: {
              halign: 'left',
              fontSize: 13,
            },
          },
        ],
      ],
      theme: 'plain',
    });
    autoTable(doc, {
      body: [
        [
          {
            content:
              'From:' +
              '\n Urban Laundry' +
              '\n Shop C-01,409/276-277,' +
              '\n Shakuntalam Apartment,' +
              '\n Mutthiganj, Near Maya Press' +
              '\n 211003 - Prayagraj' +
              '\n India',
            styles: {
              halign: 'left',
            },
          },
          {
            content:
              'Reference: #' +
              this.currentBookingData?.id +
              '\nDate: ' +
              this.currentBookingData?.slot.date.toDate().toLocaleString(),
              styles: {
                halign: 'right',
              },
          },
        ],
      ],
      theme: 'plain',
    });

    autoTable(doc, {
      body: [
        [
          {
            content:
              'Billed to:' +
                '\n ' +
                this.currentBookingData?.userDetails.displayName +
                '\n ' +
                this.currentBookingData?.userDetails.email +
                '\n ' +
                this.currentBookingData?.userDetails.phone +
                '\n ' +
                this.currentBookingData?.userDetails.deliveryAddress.address ||
              '' +
                '\n ' +
                this.currentBookingData?.userDetails.deliveryAddress.area ||
              '' +
                '\n ' +
                this.currentBookingData?.userDetails.deliveryAddress.landmark ||
              '' +
                '\n ' +
                this.currentBookingData?.userDetails.deliveryAddress.pinCode ||
              '',
            styles: {
              halign: 'left',
            },
          },
          {
            content:
              'Pickup address:' +
                '\n ' +
                this.currentBookingData?.userDetails.displayName +
                '\n ' +
                this.currentBookingData?.userDetails.email +
                '\n ' +
                this.currentBookingData?.userDetails.phone +
                '\n ' +
                this.currentBookingData?.userDetails.pickupAddress.address ||
              '' +
                '\n ' +
                this.currentBookingData?.userDetails.pickupAddress.area ||
              '' +
                '\n ' +
                this.currentBookingData?.userDetails.pickupAddress.landmark ||
              '' +
                '\n ' +
                this.currentBookingData?.userDetails.pickupAddress.pinCode ||
              '',
            styles: {
              halign: 'right',
            },
          },
        ],
      ],
      theme: 'plain',
    });

    autoTable(doc, {
      body: [
        [
          {
            content: 'Amount due:',
            styles: {
              halign: 'right',
              fontSize: 14,
            },
          },
        ],
        [
          {
            content: 'INR ' + this.currentBookingData?.billingDetail.grandTotal,
            styles: {
              halign: 'right',
              fontSize: 20,
              textColor: '#3366ff',
            },
          },
        ],
        [
          {
            content:
              'Due date: ' +
              this.currentBookingData?.slot.date.toDate().toLocaleString(),
            styles: {
              halign: 'right',
            },
          },
        ],
      ],
      theme: 'plain',
    });

    autoTable(doc, {
      body: [
        [
          {
            content: 'Products & Services',
            styles: {
              halign: 'left',
              fontSize: 14,
            },
          },
        ],
      ],
      theme: 'plain',
    });

    for (const service of this.currentBookingData.services) {
      if (service.activeClothes && service.activeClothes.length > 0) {
        autoTable(doc, {
          body: [
            [
              {
                content: toProperCase(service.name),
                styles: {
                  halign: 'left',
                  fontSize: 12,
                },
              },
            ],
          ],
          theme: 'plain',
        });
        autoTable(doc, {
          head: [['Cloth', 'Quantity']],
          body: [
            // get actoveClothes from service
            ...service.activeClothes.map((cloth) => [
              cloth.name,
              cloth.count
            ]),
          ],
          theme: 'striped',
          headStyles: {
            fillColor: '#343a40',
          },
        });
      }
    }

    autoTable(doc, {
      body: [
        [
          {
            content: 'Subtotal:',
            styles: {
              halign: 'right',
            },
          },
          {
            content: 'INR ' + this.currentBookingData?.billingDetail.total,
            styles: {
              halign: 'right',
            },
          },
        ],
        [
          {
            content: 'Discount: '+(this.currentBookingData?.billingDetail.discount || '0')+'%',
            styles: {
              halign: 'right',
            },
          },
          {
            content: 'INR -' + this.roundOff((this.currentBookingData.billingDetail.total/100)*(this.currentBookingData.billingDetail.discount || 0)),
            styles: {
              halign: 'right',
            },
          },
        ],
        [
          {
            content: 'Tax Rate: '+this.currentBookingData?.billingDetail.tax+'%',
            styles: {
              halign: 'right',
            },
          },
          {
            content: 'INR ' + this.roundOff(((this.currentBookingData.billingDetail.total-((this.currentBookingData.billingDetail.total/100)*this.currentBookingData.billingDetail.discount))/100)*this.currentBookingData.billingDetail.tax),
            styles: {
              halign: 'right',
            },
          },
        ],
        [
          {
            content: 'Total amount:',
            styles: {
              halign: 'right',
            },
          },
          {
            content: 'INR ' + this.currentBookingData?.billingDetail.grandTotal,
            styles: {
              halign: 'right',
            },
          },
        ],
      ],
      theme: 'plain',
    });

    autoTable(doc, {
      body: [
        [
          {
            content: 'Terms & notes',
            styles: {
              halign: 'left',
              fontSize: 14,
            },
          },
        ],
        [
          {
            content:
              'The mentioned billing is final and non-negotiable. ' +
              'This bill is auto generated by system and does not require any signature. ' +
              'Please contact us if you have any query and we will be happy to help you.',
            styles: {
              halign: 'left',
            },
          },
        ],
      ],
      theme: 'plain',
    });

    autoTable(doc, {
      body: [
        [
          {
            content: 'Powered by Shreeva \n shreeva.com',
            styles: {
              halign: 'center',
            },
          },
        ],
      ],
      theme: 'plain',
    });
    // const fileTransfer: TransferObject = this.transfer.create();
    let fileNameAsDateTime = new Date().toISOString();
    // if (FileSystem.checkPermissions())
    let blob = doc.output('blob');
    this.database
      .upload(
        this.dataProvider.user?.id + '/invoices/' + fileNameAsDateTime + '.pdf',
        blob
      )
      .then(async (res) => {
        await Browser.open({ url: res });
      })
      .catch((err) => {
        alert(err);
      })
      .finally(() => {
        this.dataProvider.loading = false;
      });
    return doc.save('invoice');
  }
  roundOff(num:number){
    return Math.round((num + Number.EPSILON) * 100) / 100
  }

  convertBlobToBase64 = (blob: Blob) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('Failed to convert blob to base64'));
        }
      };
      reader.readAsDataURL(blob);
    });
}
