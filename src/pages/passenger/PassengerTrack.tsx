import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import { MapPin, Navigation, Clock, Bus, Users, Phone, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

const PassengerTrack: React.FC = () => {
  const { bookings, trips, routes, buses, users } = useApp();
  const { user } = useAuth();
  const [selectedBooking, setSelectedBooking] = useState<string>('');

  const myBookings = bookings.filter(booking => 
    booking.passengerId === user?.id && 
    (booking.status === 'confirmed' || booking.status === 'completed')
  );

  const activeBookings = myBookings.filter(booking => {
    const trip = trips.find(t => t.id === booking.tripId);
    if (!trip) return false;
    
    const now = new Date();
    const departure = new Date(trip.departureTime);
    const arrival = new Date(trip.arrivalTime);
    
    return departure <= now && arrival >= now;
  });

  const selectedBookingData = selectedBooking ? 
    myBookings.find(b => b.id === selectedBooking) : 
    activeBookings[0];

  const tripData = selectedBookingData ? 
    trips.find(t => t.id === selectedBookingData.tripId) : null;
  
  const routeData = tripData ? 
    routes.find(r => r.id === tripData.routeId) : null;
  
  const busData = tripData ? 
    buses.find(b => b.id === tripData.busId) : null;
  
  const driverData = tripData ? 
    users.find(u => u.id === tripData.driverId) : null;

  // Mock location data for demonstration
  const mockLocations = [
    { name: 'Lusaka Central Station', time: '06:00', status: 'completed', lat: -15.3875, lng: 28.3228 },
    { name: 'Kabwe', time: '07:30', status: 'completed', lat: -14.4469, lng: 28.4464 },
    { name: 'Kapiri Mposhi', time: '08:15', status: 'current', lat: -13.9711, lng: 28.6697 },
    { name: 'Ndola', time: '10:00', status: 'upcoming', lat: -12.9587, lng: 28.6366 },
  ];

  const TrackingMap = () => (
    <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-xl h-96 flex items-center justify-center relative overflow-hidden">
      {/* Mock map background */}
      <div className="absolute inset-0 opacity-20">
        <div className="w-full h-full bg-gradient-to-br from-green-200 via-blue-200 to-green-300"></div>
        {/* Mock roads */}
        <div className="absolute top-1/4 left-0 right-0 h-2 bg-gray-400 transform rotate-12"></div>
        <div className="absolute top-1/2 left-0 right-0 h-2 bg-gray-400 transform -rotate-6"></div>
        <div className="absolute top-3/4 left-0 right-0 h-2 bg-gray-400 transform rotate-3"></div>
      </div>
      
      {/* Current location marker */}
      <div className="relative z-10 text-center">
        <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4 mx-auto animate-pulse">
          <Bus className="w-8 h-8 text-white" />
        </div>
        <div className="bg-white rounded-lg p-4 shadow-lg">
          <p className="font-semibold text-gray-900">Current Location</p>
          <p className="text-blue-600">Kapiri Mposhi</p>
          <p className="text-sm text-gray-600 mt-1">Speed: 65 km/h</p>
        </div>
      </div>
      
      {/* Route line */}
      <div className="absolute top-1/2 left-1/4 right-1/4 h-1 bg-blue-600 transform -translate-y-1/2"></div>
      
      {/* Start and end markers */}
      <div className="absolute top-1/2 left-8 transform -translate-y-1/2">
        <div className="w-4 h-4 bg-green-500 rounded-full"></div>
        <p className="text-xs text-gray-600 mt-1">Lusaka</p>
      </div>
      <div className="absolute top-1/2 right-8 transform -translate-y-1/2">
        <div className="w-4 h-4 bg-red-500 rounded-full"></div>
        <p className="text-xs text-gray-600 mt-1">Ndola</p>
      </div>
    </div>
  );

  const TripProgress = () => (
    <div className="space-y-4">
      {mockLocations.map((location, index) => (
        <div key={index} className="flex items-center">
          <div className="flex flex-col items-center mr-4">
            <div className={`w-4 h-4 rounded-full ${
              location.status === 'completed' ? 'bg-green-500' :
              location.status === 'current' ? 'bg-blue-500 animate-pulse' :
              'bg-gray-300'
            }`}></div>
            {index < mockLocations.length - 1 && (
              <div className={`w-0.5 h-8 mt-2 ${
                location.status === 'completed' ? 'bg-green-500' : 'bg-gray-300'
              }`}></div>
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <p className={`font-medium ${
                  location.status === 'current' ? 'text-blue-600' : 'text-gray-900'
                }`}>
                  {location.name}
                </p>
                <p className="text-sm text-gray-600">{location.time}</p>
              </div>
              <div>
                {location.status === 'completed' && (
                  <span className="text-green-600 text-sm">✓ Passed</span>
                )}
                {location.status === 'current' && (
                  <span className="text-blue-600 text-sm font-medium">📍 Current Location</span>
                )}
                {location.status === 'upcoming' && (
                  <span className="text-gray-500 text-sm">⏳ Upcoming</span>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Track Your Bus</h1>
          <p className="text-gray-600 mt-1">Real-time location and trip progress</p>
        </div>
      </div>

      {/* Booking Selection */}
      {myBookings.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Select booking to track:</label>
          <select
            value={selectedBooking}
            onChange={(e) => setSelectedBooking(e.target.value)}
            className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select a booking</option>
            {myBookings.map((booking) => {
              const trip = trips.find(t => t.id === booking.tripId);
              const route = trip ? routes.find(r => r.id === trip.routeId) : null;
              return (
                <option key={booking.id} value={booking.id}>
                  {route?.name} - {booking.qrCode} - {trip ? format(new Date(trip.departureTime), 'MMM dd') : ''}
                </option>
              );
            })}
          </select>
        </div>
      )}

      {selectedBookingData && tripData && routeData && busData ? (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Map and Progress */}
          <div className="xl:col-span-2 space-y-6">
            {/* Live Map */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Live Location</h3>
              <TrackingMap />
            </div>

            {/* Trip Progress */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Trip Progress</h3>
              <TripProgress />
            </div>
          </div>

          {/* Trip Details Sidebar */}
          <div className="space-y-6">
            {/* Trip Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Trip Information</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Bus className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Bus</p>
                    <p className="font-medium text-gray-900">{busData.plateNumber}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Route</p>
                    <p className="font-medium text-gray-900">{routeData.source} → {routeData.destination}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Clock className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Departure</p>
                    <p className="font-medium text-gray-900">
                      {format(new Date(tripData.departureTime), 'MMM dd, HH:mm')}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Users className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Your Seats</p>
                    <p className="font-medium text-gray-900">{selectedBookingData.seatNumbers.join(', ')}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Driver Contact */}
            {driverData && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Driver Contact</h3>
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-lg font-medium text-blue-600">
                      {driverData.name.charAt(0)}
                    </span>
                  </div>
                  <div className="ml-4">
                    <p className="font-medium text-gray-900">{driverData.name}</p>
                    <p className="text-sm text-gray-600">Driver</p>
                  </div>
                </div>
                <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center">
                  <Phone className="w-4 h-4 mr-2" />
                  Call Driver
                </button>
              </div>
            )}

            {/* Trip Status */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Trip Status</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Status</span>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                    tripData.status === 'in-transit' ? 'bg-green-100 text-green-800' :
                    tripData.status === 'boarding' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {tripData.status === 'in-transit' ? 'In Transit' :
                     tripData.status === 'boarding' ? 'Boarding' : 'Scheduled'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">ETA</span>
                  <span className="font-medium text-gray-900">
                    {format(new Date(tripData.arrivalTime), 'HH:mm')}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Delay</span>
                  <span className="text-green-600 text-sm">On time</span>
                </div>
              </div>
            </div>

            {/* Notifications */}
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5 mr-3" />
                <div>
                  <p className="font-medium text-orange-900">Traffic Update</p>
                  <p className="text-sm text-orange-700 mt-1">
                    Slight delay expected due to road construction near Kabwe. Estimated delay: 15 minutes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Trips</h3>
          <p className="text-gray-600 mb-6">
            You don't have any active trips to track at the moment.
          </p>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium">
            Book a Trip
          </button>
        </div>
      )}
    </div>
  );
};

export default PassengerTrack;