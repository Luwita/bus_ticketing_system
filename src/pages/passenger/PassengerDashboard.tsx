import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { MapPin, Calendar, Clock, Users, ArrowRight, Search, Filter, Plus } from 'lucide-react';
import { format } from 'date-fns';

const PassengerDashboard: React.FC = () => {
  const { routes, trips, buses, createBooking } = useApp();
  const [searchFrom, setSearchFrom] = useState('');
  const [searchTo, setSearchTo] = useState('');
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [filteredTrips, setFilteredTrips] = useState(trips);
  const [selectedTrip, setSelectedTrip] = useState<any>(null);
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [showSeatSelection, setShowSeatSelection] = useState(false);

  const handleSearch = () => {
    const filtered = trips.filter(trip => {
      const route = routes.find(r => r.id === trip.routeId);
      if (!route) return false;
      
      const matchesFrom = !searchFrom || route.source.toLowerCase().includes(searchFrom.toLowerCase());
      const matchesTo = !searchTo || route.destination.toLowerCase().includes(searchTo.toLowerCase());
      const matchesDate = !selectedDate || trip.departureTime.startsWith(selectedDate);
      
      return matchesFrom && matchesTo && matchesDate;
    });
    setFilteredTrips(filtered);
  };

  const getTripDetails = (trip: any) => {
    const route = routes.find(r => r.id === trip.routeId);
    const bus = buses.find(b => b.id === trip.busId);
    return { route, bus };
  };

  const handleSelectSeats = (trip: any) => {
    setSelectedTrip(trip);
    setSelectedSeats([]);
    setShowSeatSelection(true);
  };

  const handleSeatClick = (seatNumber: number) => {
    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(prev => prev.filter(s => s !== seatNumber));
    } else if (selectedSeats.length < 4) { // Max 4 seats
      setSelectedSeats(prev => [...prev, seatNumber]);
    }
  };

  const handleBooking = () => {
    if (selectedTrip && selectedSeats.length > 0) {
      const booking = {
        tripId: selectedTrip.id,
        passengerId: 'current-user-id', // Would come from auth context
        seatNumbers: selectedSeats,
        totalAmount: selectedTrip.price * selectedSeats.length,
        status: 'confirmed' as const,
        paymentStatus: 'paid' as const,
        bookingDate: new Date().toISOString()
      };
      
      createBooking(booking);
      setShowSeatSelection(false);
      setSelectedSeats([]);
      setSelectedTrip(null);
      alert('Booking confirmed successfully!');
    }
  };

  const SeatSelectionModal = () => {
    if (!selectedTrip || !showSeatSelection) return null;
    
    const { route, bus } = getTripDetails(selectedTrip);
    if (!route || !bus) return null;

    const renderSeatMap = () => {
      const seats = [];
      const seatsPerRow = 4;
      const rows = Math.ceil(bus.capacity / seatsPerRow);
      
      for (let row = 0; row < rows; row++) {
        const rowSeats = [];
        for (let seat = 1; seat <= seatsPerRow; seat++) {
          const seatNumber = row * seatsPerRow + seat;
          if (seatNumber > bus.capacity) break;
          
          const isBooked = selectedTrip.bookedSeats.includes(seatNumber);
          const isSelected = selectedSeats.includes(seatNumber);
          
          rowSeats.push(
            <button
              key={seatNumber}
              onClick={() => !isBooked && handleSeatClick(seatNumber)}
              disabled={isBooked}
              className={`w-10 h-10 m-1 rounded-lg border-2 font-medium text-sm transition-colors ${
                isBooked 
                  ? 'bg-red-100 border-red-300 text-red-500 cursor-not-allowed'
                  : isSelected
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : 'bg-gray-100 border-gray-300 text-gray-700 hover:border-blue-400'
              }`}
            >
              {seatNumber}
            </button>
          );
        }
        seats.push(
          <div key={row} className="flex justify-center">
            {rowSeats.slice(0, 2)}
            <div className="w-8"></div> {/* Aisle */}
            {rowSeats.slice(2)}
          </div>
        );
      }
      return seats;
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Select Your Seats</h3>
            <button
              onClick={() => setShowSeatSelection(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>

          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 mb-2">{route.name}</h4>
            <p className="text-gray-600">{format(new Date(selectedTrip.departureTime), 'MMM dd, yyyy HH:mm')}</p>
            <p className="text-gray-600">Bus: {bus.plateNumber} • ZMW {selectedTrip.price.toLocaleString()} per seat</p>
          </div>

          <div className="mb-6">
            <div className="bg-gray-100 rounded-lg p-4 mb-4">
              <div className="text-center mb-4">
                <div className="w-16 h-4 bg-gray-400 rounded-t-lg mx-auto mb-2"></div>
                <p className="text-sm text-gray-600">Driver</p>
              </div>
              <div className="space-y-2">
                {renderSeatMap()}
              </div>
            </div>
            
            <div className="flex items-center justify-center space-x-6 text-sm">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-gray-100 border-2 border-gray-300 rounded mr-2"></div>
                <span>Available</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-blue-600 rounded mr-2"></div>
                <span>Selected</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-red-100 border-2 border-red-300 rounded mr-2"></div>
                <span>Booked</span>
              </div>
            </div>
          </div>

          {selectedSeats.length > 0 && (
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-blue-900">Selected Seats: {selectedSeats.join(', ')}</p>
                  <p className="text-blue-700">Total: ZMW {(selectedTrip.price * selectedSeats.length).toLocaleString()}</p>
                </div>
                <button
                  onClick={handleBooking}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Book Now
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const recentBookings = [
    {
      id: '1',
      route: 'Lusaka - Ndola',
      date: '2024-02-15',
      time: '08:00 AM',
      status: 'confirmed',
      seat: 'A12'
    },
    {
      id: '2',
      route: 'Lusaka - Livingstone',
      date: '2024-01-28',
      time: '02:00 PM',
      status: 'completed',
      seat: 'B05'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Find Your Perfect Journey</h1>
        <p className="text-blue-100 mb-6">Search and book bus tickets for your next trip across Zambia</p>
        
        {/* Search Form */}
        <div className="bg-white rounded-xl p-6 text-gray-900">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={searchFrom}
                  onChange={(e) => setSearchFrom(e.target.value)}
                  placeholder="Departure city"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={searchTo}
                  onChange={(e) => setSearchTo(e.target.value)}
                  placeholder="Destination city"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex items-end">
              <button
                onClick={handleSearch}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center"
              >
                <Search className="w-4 h-4 mr-2" />
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Available Trips */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Available Trips</h2>
            <button className="flex items-center text-gray-600 hover:text-gray-900">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </button>
          </div>
        </div>
        
        <div className="divide-y divide-gray-200">
          {filteredTrips.map((trip) => {
            const { route, bus } = getTripDetails(trip);
            if (!route || !bus) return null;
            
            return (
              <div key={trip.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-gray-900">
                          {format(new Date(trip.departureTime), 'HH:mm')}
                        </p>
                        <p className="text-sm text-gray-600">{route.source}</p>
                      </div>
                      
                      <div className="flex-1 flex items-center">
                        <div className="flex-1 border-t-2 border-dashed border-gray-300 relative">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-white px-3">
                              <Clock className="w-4 h-4 text-gray-400" />
                            </div>
                          </div>
                        </div>
                        <ArrowRight className="w-5 h-5 text-gray-400 mx-2" />
                      </div>
                      
                      <div className="text-center">
                        <p className="text-2xl font-bold text-gray-900">
                          {format(new Date(trip.arrivalTime), 'HH:mm')}
                        </p>
                        <p className="text-sm text-gray-600">{route.destination}</p>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span className="flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          {trip.availableSeats.length} seats available
                        </span>
                        <span>{bus.type}</span>
                        <span>•</span>
                        <span>{Math.floor(route.duration / 60)}h {route.duration % 60}m</span>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="text-2xl font-bold text-gray-900">ZMW {trip.price.toLocaleString()}</p>
                          <p className="text-sm text-gray-600">per seat</p>
                        </div>
                        <button 
                          onClick={() => handleSelectSeats(trip)}
                          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Select Seats
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Actions & Recent Bookings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors">
              <MapPin className="w-6 h-6 text-blue-600 mb-2" />
              <p className="text-sm font-medium text-gray-900">Track Bus</p>
            </button>
            <button className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors">
              <Calendar className="w-6 h-6 text-blue-600 mb-2" />
              <p className="text-sm font-medium text-gray-900">Reschedule</p>
            </button>
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Bookings</h3>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">View All</button>
          </div>
          <div className="space-y-3">
            {recentBookings.map((booking) => (
              <div key={booking.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{booking.route}</p>
                  <p className="text-sm text-gray-600">{booking.date} • {booking.time}</p>
                  <p className="text-xs text-gray-500">Seat {booking.seat}</p>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  booking.status === 'confirmed' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {booking.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Seat Selection Modal */}
      <SeatSelectionModal />
    </div>
  );
};

export default PassengerDashboard;