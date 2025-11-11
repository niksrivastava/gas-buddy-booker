import { Booking, BookingStatus, CylinderType, PaymentMethod } from '@/types/booking';

const BOOKINGS_KEY = 'bookmylpg_bookings';

export const getBookings = (userId?: string): Booking[] => {
  const bookings = localStorage.getItem(BOOKINGS_KEY);
  const allBookings: Booking[] = bookings ? JSON.parse(bookings) : [];
  
  if (userId) {
    return allBookings.filter(b => b.userId === userId);
  }
  
  return allBookings;
};

const saveBookings = (bookings: Booking[]) => {
  localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
};

export const createBooking = (
  userId: string,
  cylinderType: CylinderType,
  quantity: number,
  deliveryAddress: string,
  paymentMethod: PaymentMethod
): Booking => {
  const bookings = getBookings();
  
  const amount = cylinderType === '14.2kg' ? 850 * quantity : 450 * quantity;
  
  const newBooking: Booking = {
    id: crypto.randomUUID(),
    userId,
    cylinderType,
    quantity,
    deliveryAddress,
    status: 'confirmed',
    paymentMethod,
    amount,
    createdAt: new Date().toISOString(),
    deliveryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
  };

  bookings.push(newBooking);
  saveBookings(bookings);

  return newBooking;
};

export const cancelBooking = (bookingId: string): boolean => {
  const bookings = getBookings();
  const bookingIndex = bookings.findIndex(b => b.id === bookingId);
  
  if (bookingIndex === -1) return false;
  
  bookings[bookingIndex].status = 'cancelled';
  saveBookings(bookings);
  
  return true;
};

export const getBookingById = (bookingId: string): Booking | undefined => {
  const bookings = getBookings();
  return bookings.find(b => b.id === bookingId);
};

export const getStatusColor = (status: BookingStatus): string => {
  switch (status) {
    case 'confirmed':
      return 'text-success';
    case 'pending':
      return 'text-warning';
    case 'out-for-delivery':
      return 'text-secondary';
    case 'delivered':
      return 'text-primary';
    case 'cancelled':
      return 'text-destructive';
    default:
      return 'text-muted-foreground';
  }
};

export const getStatusLabel = (status: BookingStatus): string => {
  switch (status) {
    case 'confirmed':
      return 'Confirmed';
    case 'pending':
      return 'Pending';
    case 'out-for-delivery':
      return 'Out for Delivery';
    case 'delivered':
      return 'Delivered';
    case 'cancelled':
      return 'Cancelled';
    default:
      return status;
  }
};
