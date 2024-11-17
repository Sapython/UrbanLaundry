import { Timestamp } from '@angular/fire/firestore';

export type Bookings = {
  id?:string;
  slot: Slot;
  otp: string;
  stage: Stage;
  pickupAgentId: string;
  deliveryAgentId: string;
  userId: string;
  billingDetail: BillingSummary;
  services: Service[];
  userDetails: BookingUserDetails;
  totalWeight: number;
  activeClothes:any[];
  recount:boolean;
  createdAt: Timestamp;
};
export type Slot = {
  date: Timestamp;
  startTime: Timestamp;
  endTime: Timestamp;
};

export type BillingSummary = {
  total: number;
  couponCodeId: string;
  discount: number;
  tax: number;
  grandTotal: number;
};

export interface Service {
  id?: string;
  name: string;
  image: string;
  clothes: Cloth[];
  costPerKg: number;
  type: null | true;
  description: string;
  enabled: boolean;
  activeClothes:ActiveCloth[]
}

export type ActiveCloth = {
  checked: boolean;
  cost: number;
  count: number;
  name: string;
}
export type BookingUserDetails = {
  userId: string;
  displayId: string;
  pickupAddress: Address;
  deliveryAddress: Address;
  phone: string;
  photoURL: string;
  displayName: string;
  email: string;
};

export interface Cloth {
  id?: string;
  name: string;
  cost: number;
}

export type Stage = {
  stage:
  | 'pending'
  | 'pickupAssigned'
  | 'pickupStarted'
  | 'pickupReceived'
  | 'pickupCompleted'
  | 'washInProgress'
  | 'washCompleted'
  | 'deliveryAssigned'
  | 'outForDelivery'
  | 'deliveryCompleted' 
  | 'cancelled';
  message: string;
  log: StageLog[];
};
export type StageLog = {
  userId: string;
  date: Timestamp;
  additionalData?: any;
  message: string;
  stage:
  | 'pending'
  | 'pickupAssigned'
  | 'pickupStarted'
  | 'pickupReceived'
  | 'pickupCompleted'
  | 'washInProgress'
  | 'washCompleted'
  | 'deliveryAssigned'
  | 'outForDelivery'
  | 'deliveryCompleted' 
  | 'cancelled';
};

export type Address = {
  address: string;
  landmark: string;
  area: {
    name: string;
    id: string;
  };
  pinCode: string;
  longitude?: number;
  latitude?: number;
};

export interface Counters {
  bookings: number;
  users: number;
}