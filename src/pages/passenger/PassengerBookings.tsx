import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import { Ticket, Calendar, MapPin, Clock, Download, RefreshCw, XCircle, CheckCircle, Receipt } from 'lucide-react';
import { format } from 'date-fns';

const PassengerBookings: React.FC = () => {
  const { bookings, trips, routes, buses } = useApp();
  const { user } = useAuth();
  const [filterStatus, setFilterStatus] = useState('all');

  const myBookings = bookings.filter(booking => booking.passengerId === user?.id);

  const filteredBookings = myBookings.filter(booking => 
    filterStatus === 'all' || booking.status === filterStatus
  );

  const bookingStats = {
    total: myBookings.length,
    confirmed: myBookings.filter(b => b.status === 'confirmed').length,
    completed: myBookings.filter(b => b.status === 'completed').length,
    cancelled: myBookings.filter(b => b.status === 'cancelled').length
  };

  const handleDownloadTicket = (booking: any) => {
    // Create a simple ticket content
    const trip = trips.find(t => t.id === booking.tripId);
    const route = trip ? routes.find(r => r.id === trip.routeId) : null;
    const bus = trip ? buses.find(b => b.id === trip.busId) : null;
    
    if (!trip || !route || !bus) return;

    const ticketContent = `
ZAMBIANBUS TICKET
================
Booking Reference: ${booking.qrCode}
Route: ${route.source} → ${route.destination}
Date: ${format(new Date(trip.departureTime), 'MMM dd, yyyy')}
Time: ${format(new Date(trip.departureTime), 'HH:mm')}
Bus: ${bus.plateNumber}
Seats: ${booking.seatNumbers.join(', ')}
Amount: ZMW ${booking.totalAmount.toLocaleString()}
Status: ${booking.status.toUpperCase()}
================
Thank you for choosing ZambianBus!
    `;

    const blob = new Blob([ticketContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ticket-${booking.qrCode}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadReceipt = (booking: any) => {
    const trip = trips.find(t => t.id === booking.tripId);
    const route = trip ? routes.find(r => r.id === trip.routeId) : null;
    
    if (!trip || !route) return;

    const receiptContent = `
ZAMBIANBUS PAYMENT RECEIPT
=========================
Receipt No: RCP-${booking.id}
Date: ${format(new Date(booking.bookingDate), 'MMM dd, yyyy HH:mm')}

PASSENGER DETAILS:
Name: ${user?.name}
Email: ${user?.email}
Phone: ${user?.phone}

TRIP DETAILS:
Route: ${route.source} → ${route.destination}
Departure: ${format(new Date(trip.departureTime), 'MMM dd, yyyy HH:mm')}
Seats: ${booking.seatNumbers.join(', ')}

PAYMENT DETAILS:
Subtotal: ZMW ${booking.totalAmount.toLocaleString()}
Service Fee: ZMW 0
Total Paid: ZMW ${booking.totalAmount.toLocaleString()}
Payment Status: ${booking.paymentStatus.toUpperCase()}

=========================
Thank you for your business!
    `;

    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt-${booking.qrCode}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const BookingCard = ({ booking }: { booking: any }) => {
    const trip = trips.find(t => t.id === booking.tripId);
    const route = trip ? routes.find(r => r.id === trip.routeId) : null;
    const bus = trip ? buses.find(b => b.id === trip.busId) : null;

    if (!trip || !route || !bus) return null;

    const isUpcoming = new Date(trip.departureTime) > new Date();
    const isPast = new Date(trip.arrivalTime) < new Date();

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-xl">
              <Ticket className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">{route.name}</h3>
              <p className="text-sm text-gray-600">Booking #{booking.qrCode}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`px-3 py-1 text-xs font-medium rounded-full ${
              booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
              booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
              'bg-purple-100 text-purple-800'
            }`}>
              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
            </span>
            <span className={`px-3 py-1 text-xs font-medium rounded-full ${
              booking.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' :
              booking.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="flex items-center">
            <MapPin className="w-4 h-4 text-gray-400 mr-2" />
            <div>
              <p className="text-sm text-gray-600">Route</p>
              <p className="font-medium text-gray-900">{route.source} → {route.destination}</p>
            </div>
          </div>
          <div className="flex items-center">
            <Calendar className="w-4 h-4 text-gray-400 mr-2" />
            <div>
              <p className="text-sm text-gray-600">Departure</p>
              <p className="font-medium text-gray-900">
                {format(new Date(trip.departureTime), 'MMM dd, yyyy')}
              </p>
            </div>
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 text-gray-400 mr-2" />
            <div>
              <p className="text-sm text-gray-600">Time</p>
              <p className="font-medium text-gray-900">
                {format(new Date(trip.departureTime), 'HH:mm')}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="flex items-center space-x-4">
            <div>
              <p className="text-sm text-gray-600">Seats</p>
              <p className="font-medium text-gray-900">{booking.seatNumbers.join(', ')}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Bus</p>
              <p className="font-medium text-gray-900">{bus.plateNumber}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="font-medium text-gray-900">ZMW {booking.totalAmount.toLocaleString()}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {isUpcoming && booking.status === 'confirmed' && (
              <>
                <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                  Reschedule
                </button>
                <button className="text-red-600 hover:text-red-700 font-medium text-sm">
                  Cancel
                </button>
              </>
            )}
            <button 
              onClick={() => handleDownloadReceipt(booking)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center text-sm"
            >
              <Receipt className="w-4 h-4 mr-2" />
              Receipt
            </button>
            <button 
              onClick={() => handleDownloadTicket(booking)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center text-sm"
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
          <p className="text-gray-600 mt-1">Manage your bus ticket bookings</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Bookings</p>
              <p className="text-2xl font-bold text-gray-900">{bookingStats.total}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-xl">
              <Ticket className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Confirmed</p>
              <p className="text-2xl font-bold text-gray-900">{bookingStats.confirmed}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-xl">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{bookingStats.completed}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-xl">
              <CheckCircle className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Cancelled</p>
              <p className="text-2xl font-bold text-gray-900">{bookingStats.cancelled}</p>
            </div>
            <div className="bg-red-100 p-3 rounded-xl">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">Filter by status:</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Bookings</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {filteredBookings.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <Ticket className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
            <p className="text-gray-600 mb-6">You haven't made any bookings yet or no bookings match your filter.</p>
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium">
              Book a Trip
            </button>
          </div>
        ) : (
          filteredBookings.map((booking) => (
            <BookingCard key={booking.id} booking={booking} />
          ))
        )}
      </div>
    </div>
  );
};

export default PassengerBookings;