export type BookingStatus = 'pending' | 'confirmed' | 'out-for-delivery' | 'delivered' | 'cancelled';
export type CylinderType = '14.2kg' | '5kg';
export type PaymentMethod = 'card' | 'upi' | 'netbanking' | 'cod';

export interface Booking {
  id: string;
  userId: string;
  cylinderType: CylinderType;
  quantity: number;
  deliveryAddress: string;
  status: BookingStatus;
  paymentMethod: PaymentMethod;
  amount: number;
  createdAt: string;
  deliveryDate?: string;
}
