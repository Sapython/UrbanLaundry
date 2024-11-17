import { Injectable } from '@angular/core';
import { AlertsAndNotificationsService } from 'src/services/uiService/alerts-and-notifications.service';

import { registerPlugin } from '@capacitor/core';
import { Platform } from '@ionic/angular';

export interface PrinterIntegration {
  echo(): Promise<{ addresses: string }>;
  connectToPrinter(options: {
    address: string;
    type: 'bt' | 'ble';
  }): Promise<{ status: string }>;
  printLabel(options: {
    labels: string[];
    qrData: string;
  }): Promise<{ status: string }>;
  checkStatus(): Promise<{ status: string }>;
}

const PrinterIntegration =
  registerPlugin<PrinterIntegration>('PrinterIntegration');
export default PrinterIntegration;
@Injectable({
  providedIn: 'root',
})
export class PrintingService {
  constructor(
    private alertify: AlertsAndNotificationsService,
    private platform: Platform
  ) {}

  printLabel(labels: string[], qrData: string) {
    labels.push("ID:"+qrData);
    return PrinterIntegration.printLabel({labels: labels,qrData: qrData})
  }
}
