import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Bus, Route, Trip, Booking, User } from '../types';

interface AppContextType {
  buses: Bus[];
  routes: Route[];
  trips: Trip[];
  bookings: Booking[];
  users: User[];
  addBus: (bus: Omit<Bus, 'id'>) => void;
  updateBus: (id: string, bus: Partial<Bus>) => void;
  addRoute: (route: Omit<Route, 'id'>) => void;
  addTrip: (trip: Omit<Trip, 'id'>) => void;
  createBooking: (booking: Omit<Booking, 'id' | 'qrCode'>) => void;
  addUser: (user: Omit<User, 'id'>) => void;
  updateUser: (id: string, user: Partial<User>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

// Zambian mock data
const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@zambianbus.com',
    name: 'Chanda Mwansa',
    phone: '+260977123456',
    role: 'admin',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    email: 'passenger@example.com',
    name: 'Mutale Banda',
    phone: '+260966789012',
    role: 'passenger',
    createdAt: '2024-01-15T00:00:00Z'
  },
  {
    id: '3',
    email: 'driver@zambianbus.com',
    name: 'Joseph Phiri',
    phone: '+260955345678',
    role: 'driver',
    createdAt: '2024-01-10T00:00:00Z'
  },
  {
    id: '4',
    email: 'mary.tembo@example.com',
    name: 'Mary Tembo',
    phone: '+260944567890',
    role: 'passenger',
    createdAt: '2024-01-20T00:00:00Z'
  },
  {
    id: '5',
    email: 'driver2@zambianbus.com',
    name: 'Patrick Mulenga',
    phone: '+260933456789',
    role: 'driver',
    createdAt: '2024-01-12T00:00:00Z'
  }
];

const mockBuses: Bus[] = [
  {
    id: '1',
    plateNumber: 'ACB 1234',
    capacity: 50,
    type: 'AC',
    features: ['WiFi', 'Charging Ports', 'Entertainment', 'Reclining Seats'],
    status: 'active',
    driverId: '3'
  },
  {
    id: '2',
    plateNumber: 'ACA 5678',
    capacity: 45,
    type: 'Luxury',
    features: ['Reclining Seats', 'WiFi', 'Refreshments', 'Air Conditioning'],
    status: 'active',
    driverId: '5'
  },
  {
    id: '3',
    plateNumber: 'ACE 9012',
    capacity: 40,
    type: 'Non-AC',
    features: ['Comfortable Seats', 'Music System'],
    status: 'maintenance'
  },
  {
    id: '4',
    plateNumber: 'ACD 3456',
    capacity: 35,
    type: 'Sleeper',
    features: ['Sleeping Berths', 'Air Conditioning', 'Privacy Curtains'],
    status: 'active'
  }
];

const mockRoutes: Route[] = [
  {
    id: '1',
    name: 'Lusaka - Ndola Express',
    source: 'Lusaka',
    destination: 'Ndola',
    stops: ['Kabwe', 'Kapiri Mposhi'],
    duration: 240,
    distance: 320,
    basePrice: 150
  },
  {
    id: '2',
    name: 'Lusaka - Livingstone Highway',
    source: 'Lusaka',
    destination: 'Livingstone',
    stops: ['Mazabuka', 'Monze', 'Choma'],
    duration: 300,
    distance: 470,
    basePrice: 200
  },
  {
    id: '3',
    name: 'Ndola - Kitwe Route',
    source: 'Ndola',
    destination: 'Kitwe',
    stops: ['Luanshya'],
    duration: 90,
    distance: 65,
    basePrice: 50
  },
  {
    id: '4',
    name: 'Lusaka - Chipata Express',
    source: 'Lusaka',
    destination: 'Chipata',
    stops: ['Nyimba', 'Petauke'],
    duration: 360,
    distance: 550,
    basePrice: 250
  },
  {
    id: '5',
    name: 'Lusaka - Solwezi Route',
    source: 'Lusaka',
    destination: 'Solwezi',
    stops: ['Mumbwa', 'Kaoma', 'Kasempa'],
    duration: 480,
    distance: 650,
    basePrice: 300
  }
];

const mockTrips: Trip[] = [
  {
    id: '1',
    routeId: '1',
    busId: '1',
    driverId: '3',
    departureTime: '2024-02-15T06:00:00Z',
    arrivalTime: '2024-02-15T10:00:00Z',
    price: 180,
    availableSeats: Array.from({length: 50}, (_, i) => i + 1).filter(n => ![1, 2, 15, 30, 45].includes(n)),
    bookedSeats: [1, 2, 15, 30, 45],
    status: 'scheduled'
  },
  {
    id: '2',
    routeId: '2',
    busId: '2',
    driverId: '5',
    departureTime: '2024-02-15T08:00:00Z',
    arrivalTime: '2024-02-15T13:00:00Z',
    price: 220,
    availableSeats: Array.from({length: 45}, (_, i) => i + 1).filter(n => ![5, 12, 20].includes(n)),
    bookedSeats: [5, 12, 20],
    status: 'scheduled'
  },
  {
    id: '3',
    routeId: '3',
    busId: '4',
    driverId: '3',
    departureTime: '2024-02-16T14:00:00Z',
    arrivalTime: '2024-02-16T15:30:00Z',
    price: 60,
    availableSeats: Array.from({length: 35}, (_, i) => i + 1).filter(n => ![8, 16].includes(n)),
    bookedSeats: [8, 16],
    status: 'scheduled'
  }
];

const mockBookings: Booking[] = [
  {
    id: '1',
    tripId: '1',
    passengerId: '2',
    seatNumbers: [1, 2],
    totalAmount: 360,
    status: 'confirmed',
    paymentStatus: 'paid',
    bookingDate: '2024-02-10T10:30:00Z',
    qrCode: 'QR1707562200000'
  },
  {
    id: '2',
    tripId: '2',
    passengerId: '4',
    seatNumbers: [5],
    totalAmount: 220,
    status: 'confirmed',
    paymentStatus: 'paid',
    bookingDate: '2024-02-12T14:15:00Z',
    qrCode: 'QR1707735300000'
  }
];

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [buses, setBuses] = useState<Bus[]>(mockBuses);
  const [routes, setRoutes] = useState<Route[]>(mockRoutes);
  const [trips, setTrips] = useState<Trip[]>(mockTrips);
  const [bookings, setBookings] = useState<Booking[]>(mockBookings);
  const [users, setUsers] = useState<User[]>(mockUsers);

  const addBus = (bus: Omit<Bus, 'id'>) => {
    const newBus: Bus = {
      ...bus,
      id: Date.now().toString()
    };
    setBuses(prev => [...prev, newBus]);
  };

  const updateBus = (id: string, busUpdate: Partial<Bus>) => {
    setBuses(prev => prev.map(bus => bus.id === id ? { ...bus, ...busUpdate } : bus));
  };

  const addRoute = (route: Omit<Route, 'id'>) => {
    const newRoute: Route = {
      ...route,
      id: Date.now().toString()
    };
    setRoutes(prev => [...prev, newRoute]);
  };

  const addTrip = (trip: Omit<Trip, 'id'>) => {
    const newTrip: Trip = {
      ...trip,
      id: Date.now().toString()
    };
    setTrips(prev => [...prev, newTrip]);
  };

  const createBooking = (booking: Omit<Booking, 'id' | 'qrCode'>) => {
    const newBooking: Booking = {
      ...booking,
      id: Date.now().toString(),
      qrCode: `QR${Date.now()}`
    };
    setBookings(prev => [...prev, newBooking]);
    
    // Update trip booked seats
    setTrips(prev => prev.map(trip => 
      trip.id === booking.tripId 
        ? {
            ...trip,
            bookedSeats: [...trip.bookedSeats, ...booking.seatNumbers],
            availableSeats: trip.availableSeats.filter(seat => !booking.seatNumbers.includes(seat))
          }
        : trip
    ));
  };

  const addUser = (user: Omit<User, 'id'>) => {
    const newUser: User = {
      ...user,
      id: Date.now().toString()
    };
    setUsers(prev => [...prev, newUser]);
  };

  const updateUser = (id: string, userUpdate: Partial<User>) => {
    setUsers(prev => prev.map(user => user.id === id ? { ...user, ...userUpdate } : user));
  };

  return (
    <AppContext.Provider value={{
      buses,
      routes,
      trips,
      bookings,
      users,
      addBus,
      updateBus,
      addRoute,
      addTrip,
      createBooking,
      addUser,
      updateUser
    }}>
      {children}
    </AppContext.Provider>
  );
};