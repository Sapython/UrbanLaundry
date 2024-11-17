export type DeliveryItem = {
    itemId: string;
    itemName: string;
    itemPrice: number;
    itemQuantity: number;
    service: 'wash' | 'wash&Iron' | 'dryClean' | 'Iron';
  };
  