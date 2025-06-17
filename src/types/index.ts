export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: 'admin' | 'passenger' | 'driver';
  avatar?: string;
  createdAt: string;
}

export interface Bus {
  id: string;
  plateNumber: string;
  capacity: number;
  type: 'AC' | 'Non-AC' | 'Luxury' | 'Sleeper';
  features: string[];
  status: 'active' | 'maintenance' | 'inactive';
  driverId?: string;
}

export interface Route {
  id: string;
  name: string;
  source: string;
  destination: string;
  stops: string[];
  duration: number; // in minutes
  distance: number; // in km
  basePrice: number;
}

export interface Trip {
  id: string;
  routeId: string;
  busId: string;
  driverId: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
  availableSeats: number[];
  bookedSeats: number[];
  status: 'scheduled' | 'boarding' | 'in-transit' | 'arrived' | 'cancelled';
}

export interface Booking {
  id: string;
  tripId: string;
  passengerId: string;
  seatNumbers: number[];
  totalAmount: number;
  status: 'confirmed' | 'cancelled' | 'completed';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  bookingDate: string;
  qrCode: string;
}

export interface Payment {
  id: string;
  bookingId: string;
  amount: number;
  method: 'card' | 'mobile-money' | 'wallet';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  transactionId: string;
  date: string;
}