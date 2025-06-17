import React from 'react';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import { Clock, MapPin, Users, CheckCircle, AlertCircle, Navigation, Play, Square, QrCode } from 'lucide-react';
import { format } from 'date-fns';

const DriverDashboard: React.FC = () => {
  const { trips, routes, buses } = useApp();
  const { user } = useAuth();

  // Filter trips assigned to current driver
  const myTrips = trips.filter(trip => trip.driverId === user?.id);
  const currentTrip = myTrips.find(trip => trip.status === 'in-transit' || trip.status === 'boarding');
  const upcomingTrips = myTrips.filter(trip => trip.status === 'scheduled');

  const getTripDetails = (trip: any) => {
    const route = routes.find(r => r.id === trip.routeId);
    const bus = buses.find(b => b.id === trip.busId);
    return { route, bus };
  };

  const handleStartTrip = (tripId: string) => {
    // Mock start trip functionality
    alert(`Starting trip ${tripId}. Passengers will be notified.`);
  };

  const handleViewDetails = (trip: any) => {
    const { route, bus } = getTripDetails(trip);
    if (!route || !bus) return;
    
    alert(`Trip Details:
Route: ${route.name}
Bus: ${bus.plateNumber}
Departure: ${format(new Date(trip.departureTime), 'MMM dd, yyyy HH:mm')}
Passengers: ${trip.bookedSeats.length}/${bus.capacity}
Status: ${trip.status}`);
  };

  const handleOpenScanner = () => {
    alert('QR Code scanner opened. Point camera at passenger tickets to check them in.');
  };

  const handleStartNavigation = () => {
    alert('GPS navigation started. Follow the route guidance on your device.');
  };

  const handleReportIssue = () => {
    alert('Issue reporting form opened. Describe the problem and submit to dispatch.');
  };

  const tripStats = [
    {
      title: 'Today\'s Trips',
      value: myTrips.filter(trip => 
        new Date(trip.departureTime).toDateString() === new Date().toDateString()
      ).length,
      icon: Clock,
      color: 'bg-blue-500'
    },
    {
      title: 'Passengers',
      value: currentTrip ? currentTrip.bookedSeats.length : 0,
      icon: Users,
      color: 'bg-green-500'
    },
    {
      title: 'Completed Trips',
      value: myTrips.filter(trip => trip.status === 'arrived').length,
      icon: CheckCircle,
      color: 'bg-purple-500'
    },
    {
      title: 'Pending Check-ins',
      value: currentTrip ? currentTrip.bookedSeats.length : 0,
      icon: AlertCircle,
      color: 'bg-orange-500'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Driver Dashboard</h1>
        <div className="flex items-center space-x-3">
          <div className="flex items-center text-sm text-gray-500">
            <div className={`w-2 h-2 rounded-full mr-2 ${currentTrip ? 'bg-green-400' : 'bg-gray-400'}`}></div>
            Status: {currentTrip ? 'On Duty' : 'Off Duty'}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {tripStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-xl`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Current Trip */}
      {currentTrip && (
        <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-8 text-white">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Current Trip</h2>
              <p className="text-green-100">You are currently on a trip</p>
            </div>
            <div className="flex items-center space-x-3">
              <button 
                onClick={handleStartNavigation}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg transition-colors flex items-center"
              >
                <Navigation className="w-4 h-4 mr-2" />
                Navigate
              </button>
              <button className="bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg transition-colors flex items-center">
                <Square className="w-4 h-4 mr-2" />
                End Trip
              </button>
            </div>
          </div>
          
          {(() => {
            const { route, bus } = getTripDetails(currentTrip);
            if (!route || !bus) return null;
            
            return (
              <div className="bg-white bg-opacity-10 rounded-xl p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <p className="text-green-100 text-sm mb-1">Route</p>
                    <p className="text-xl font-semibold">{route.source} → {route.destination}</p>
                  </div>
                  <div>
                    <p className="text-green-100 text-sm mb-1">Departure Time</p>
                    <p className="text-xl font-semibold">{format(new Date(currentTrip.departureTime), 'HH:mm')}</p>
                  </div>
                  <div>
                    <p className="text-green-100 text-sm mb-1">Passengers</p>
                    <p className="text-xl font-semibold">{currentTrip.bookedSeats.length} / {bus.capacity}</p>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Upcoming Trips */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Upcoming Trips</h2>
        </div>
        
        <div className="divide-y divide-gray-200">
          {upcomingTrips.length === 0 ? (
            <div className="p-8 text-center">
              <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No upcoming trips scheduled</p>
            </div>
          ) : (
            upcomingTrips.map((trip) => {
              const { route, bus } = getTripDetails(trip);
              if (!route || !bus) return null;
              
              return (
                <div key={trip.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-6">
                        <div>
                          <p className="text-lg font-semibold text-gray-900">{route.source} → {route.destination}</p>
                          <p className="text-sm text-gray-600">Bus {bus.plateNumber}</p>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {format(new Date(trip.departureTime), 'MMM dd, HH:mm')}
                          </div>
                          <div className="flex items-center">
                            <Users className="w-4 h-4 mr-1" />
                            {trip.bookedSeats.length} passengers
                          </div>
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {Math.floor(route.duration / 60)}h {route.duration % 60}m
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <button 
                        onClick={() => handleViewDetails(trip)}
                        className="text-blue-600 hover:text-blue-700 font-medium"
                      >
                        View Details
                      </button>
                      <button 
                        onClick={() => handleStartTrip(trip.id)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Start Trip
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <div className="bg-blue-100 p-3 rounded-xl">
              <QrCode className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 ml-4">Passenger Check-in</h3>
          </div>
          <p className="text-gray-600 mb-4">Scan passenger tickets and manage boarding</p>
          <button 
            onClick={handleOpenScanner}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Open Scanner
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <div className="bg-green-100 p-3 rounded-xl">
              <Navigation className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 ml-4">Navigation</h3>
          </div>
          <p className="text-gray-600 mb-4">Get route directions and traffic updates</p>
          <button 
            onClick={handleStartNavigation}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
          >
            Start Navigation
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <div className="bg-orange-100 p-3 rounded-xl">
              <AlertCircle className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 ml-4">Report Issue</h3>
          </div>
          <p className="text-gray-600 mb-4">Report technical issues or emergencies</p>
          <button 
            onClick={handleReportIssue}
            className="w-full bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors"
          >
            Report Issue
          </button>
        </div>
      </div>
    </div>
  );
};

export default DriverDashboard;