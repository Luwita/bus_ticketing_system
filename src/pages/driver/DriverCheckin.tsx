import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import { QrCode, Users, CheckCircle, XCircle, Search, User, Ticket } from 'lucide-react';
import { format } from 'date-fns';

const DriverCheckin: React.FC = () => {
  const { trips, routes, buses, bookings, users } = useApp();
  const { user } = useAuth();
  const [selectedTrip, setSelectedTrip] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [scannerActive, setScannerActive] = useState(false);
  const [checkedInPassengers, setCheckedInPassengers] = useState<string[]>([]);

  const myTrips = trips.filter(trip => 
    trip.driverId === user?.id && 
    (trip.status === 'scheduled' || trip.status === 'boarding' || trip.status === 'in-transit')
  );

  const currentTrip = myTrips.find(trip => trip.status === 'boarding' || trip.status === 'in-transit');
  const activeTripData = selectedTrip ? 
    myTrips.find(t => t.id === selectedTrip) : 
    currentTrip;

  const routeData = activeTripData ? 
    routes.find(r => r.id === activeTripData.routeId) : null;
  
  const busData = activeTripData ? 
    buses.find(b => b.id === activeTripData.busId) : null;

  const tripBookings = activeTripData ? 
    bookings.filter(b => b.tripId === activeTripData.id && b.status === 'confirmed') : [];

  const filteredBookings = tripBookings.filter(booking => {
    const passenger = users.find(u => u.id === booking.passengerId);
    return passenger ? 
      passenger.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.qrCode.toLowerCase().includes(searchTerm.toLowerCase()) : false;
  });

  const handleCheckIn = (bookingId: string) => {
    if (checkedInPassengers.includes(bookingId)) {
      setCheckedInPassengers(prev => prev.filter(id => id !== bookingId));
    } else {
      setCheckedInPassengers(prev => [...prev, bookingId]);
    }
  };

  const QRScanner = () => (
    <div className="bg-gray-100 rounded-xl h-64 flex items-center justify-center">
      <div className="text-center">
        <QrCode className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">QR Code Scanner</p>
        <p className="text-sm text-gray-500 mt-2">
          Point camera at passenger's QR code
        </p>
        <button 
          onClick={() => setScannerActive(false)}
          className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
        >
          Stop Scanner
        </button>
      </div>
    </div>
  );

  const PassengerList = () => (
    <div className="space-y-3">
      {filteredBookings.map((booking) => {
        const passenger = users.find(u => u.id === booking.passengerId);
        const isCheckedIn = checkedInPassengers.includes(booking.id);
        
        if (!passenger) return null;

        return (
          <div key={booking.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold text-gray-900">{passenger.name}</h3>
                  <p className="text-sm text-gray-600">{passenger.phone}</p>
                  <div className="flex items-center mt-1">
                    <Ticket className="w-4 h-4 text-gray-400 mr-1" />
                    <span className="text-sm text-gray-600">
                      Seats: {booking.seatNumbers.join(', ')} • {booking.qrCode}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm text-gray-600">Amount</p>
                  <p className="font-medium text-gray-900">ZMW {booking.totalAmount}</p>
                </div>
                
                <button
                  onClick={() => handleCheckIn(booking.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center ${
                    isCheckedIn
                      ? 'bg-green-100 text-green-800 hover:bg-green-200'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {isCheckedIn ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Checked In
                    </>
                  ) : (
                    <>
                      <Users className="w-4 h-4 mr-2" />
                      Check In
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Passenger Check-in</h1>
          <p className="text-gray-600 mt-1">Scan tickets and manage passenger boarding</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setScannerActive(!scannerActive)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center ${
              scannerActive
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            <QrCode className="w-4 h-4 mr-2" />
            {scannerActive ? 'Stop Scanner' : 'Start QR Scanner'}
          </button>
        </div>
      </div>

      {/* Trip Selection */}
      {myTrips.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Select trip for check-in:</label>
          <select
            value={selectedTrip}
            onChange={(e) => setSelectedTrip(e.target.value)}
            className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select a trip</option>
            {myTrips.map((trip) => {
              const route = routes.find(r => r.id === trip.routeId);
              return (
                <option key={trip.id} value={trip.id}>
                  {route?.name} - {format(new Date(trip.departureTime), 'MMM dd, HH:mm')}
                </option>
              );
            })}
          </select>
        </div>
      )}

      {activeTripData && routeData && busData ? (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="xl:col-span-2 space-y-6">
            {/* QR Scanner */}
            {scannerActive && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">QR Code Scanner</h3>
                <QRScanner />
              </div>
            )}

            {/* Search and Passenger List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Passenger List</h3>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search passengers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              {filteredBookings.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No passengers found for this trip</p>
                </div>
              ) : (
                <PassengerList />
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Trip Summary */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Trip Summary</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Route</span>
                  <span className="font-medium text-gray-900">{routeData.source} → {routeData.destination}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Bus</span>
                  <span className="font-medium text-gray-900">{busData.plateNumber}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Departure</span>
                  <span className="font-medium text-gray-900">
                    {format(new Date(activeTripData.departureTime), 'MMM dd, HH:mm')}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Status</span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    activeTripData.status === 'boarding' ? 'bg-blue-100 text-blue-800' :
                    activeTripData.status === 'in-transit' ? 'bg-green-100 text-green-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {activeTripData.status === 'boarding' ? 'Boarding' :
                     activeTripData.status === 'in-transit' ? 'In Transit' : 'Scheduled'}
                  </span>
                </div>
              </div>
            </div>

            {/* Check-in Statistics */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Check-in Progress</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Passengers Checked In</span>
                    <span className="font-medium text-gray-900">
                      {checkedInPassengers.length} / {tripBookings.length}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all duration-300" 
                      style={{ 
                        width: `${tripBookings.length > 0 ? (checkedInPassengers.length / tripBookings.length) * 100 : 0}%` 
                      }}
                    ></div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center justify-center mb-1">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <p className="text-2xl font-bold text-green-600">{checkedInPassengers.length}</p>
                    <p className="text-xs text-green-700">Checked In</p>
                  </div>
                  
                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <div className="flex items-center justify-center mb-1">
                      <XCircle className="w-5 h-5 text-orange-600" />
                    </div>
                    <p className="text-2xl font-bold text-orange-600">
                      {tripBookings.length - checkedInPassengers.length}
                    </p>
                    <p className="text-xs text-orange-700">Pending</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
                  Mark All as Checked In
                </button>
                <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                  Start Trip
                </button>
                <button className="w-full bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors">
                  Report Issue
                </button>
              </div>
            </div>

            {/* No-Show Passengers */}
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <h4 className="font-medium text-red-900 mb-2">No-Show Policy</h4>
              <p className="text-sm text-red-700">
                Passengers who don't check in within 15 minutes of departure time will be marked as no-show.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Trip</h3>
          <p className="text-gray-600 mb-6">
            You don't have any active trips for passenger check-in at the moment.
          </p>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium">
            View Scheduled Trips
          </button>
        </div>
      )}
    </div>
  );
};

export default DriverCheckin;