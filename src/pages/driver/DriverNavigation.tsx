import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import { Navigation, MapPin, Clock, AlertTriangle, Phone, Fuel, Settings } from 'lucide-react';
import { format } from 'date-fns';

const DriverNavigation: React.FC = () => {
  const { trips, routes, buses } = useApp();
  const { user } = useAuth();
  const [selectedTrip, setSelectedTrip] = useState<string>('');

  const myTrips = trips.filter(trip => 
    trip.driverId === user?.id && 
    (trip.status === 'scheduled' || trip.status === 'boarding' || trip.status === 'in-transit')
  );

  const currentTrip = myTrips.find(trip => trip.status === 'in-transit' || trip.status === 'boarding');
  const activeTripData = selectedTrip ? 
    myTrips.find(t => t.id === selectedTrip) : 
    currentTrip;

  const routeData = activeTripData ? 
    routes.find(r => r.id === activeTripData.routeId) : null;
  
  const busData = activeTripData ? 
    buses.find(b => b.id === activeTripData.busId) : null;

  // Mock navigation data
  const navigationData = {
    currentLocation: 'Kapiri Mposhi',
    nextStop: 'Ndola',
    distanceToNext: '45 km',
    estimatedTime: '35 min',
    totalDistance: '320 km',
    remainingDistance: '65 km',
    fuelLevel: 75,
    speed: 65,
    trafficCondition: 'moderate'
  };

  const NavigationMap = () => (
    <div className="bg-gray-100 rounded-xl h-96 flex items-center justify-center relative">
      <div className="text-center">
        <Navigation className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">GPS Navigation Map</p>
        <p className="text-sm text-gray-500 mt-2">
          Current location: {navigationData.currentLocation}
        </p>
      </div>
      
      {/* Mock navigation overlay */}
      <div className="absolute top-4 left-4 bg-white rounded-lg p-3 shadow-md">
        <div className="flex items-center text-sm">
          <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
          <span className="font-medium">{navigationData.speed} km/h</span>
        </div>
      </div>
      
      <div className="absolute top-4 right-4 bg-white rounded-lg p-3 shadow-md">
        <div className="flex items-center text-sm">
          <Fuel className="w-4 h-4 text-gray-400 mr-2" />
          <span className="font-medium">{navigationData.fuelLevel}%</span>
        </div>
      </div>
    </div>
  );

  const RouteProgress = () => {
    if (!routeData) return null;

    const stops = [routeData.source, ...routeData.stops, routeData.destination];
    const currentIndex = stops.indexOf(navigationData.currentLocation);

    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Route Progress</h3>
        <div className="space-y-3">
          {stops.map((stop, index) => (
            <div key={index} className="flex items-center">
              <div className="flex flex-col items-center mr-4">
                <div className={`w-4 h-4 rounded-full ${
                  index < currentIndex ? 'bg-green-500' :
                  index === currentIndex ? 'bg-blue-500' :
                  'bg-gray-300'
                }`}></div>
                {index < stops.length - 1 && (
                  <div className={`w-0.5 h-8 mt-2 ${
                    index < currentIndex ? 'bg-green-500' : 'bg-gray-300'
                  }`}></div>
                )}
              </div>
              <div className="flex-1">
                <p className={`font-medium ${
                  index === currentIndex ? 'text-blue-600' : 'text-gray-900'
                }`}>
                  {stop}
                </p>
                {index === currentIndex && (
                  <p className="text-sm text-blue-600">Current location</p>
                )}
                {index === currentIndex + 1 && (
                  <p className="text-sm text-gray-600">
                    Next stop - {navigationData.distanceToNext} ({navigationData.estimatedTime})
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Navigation</h1>
          <p className="text-gray-600 mt-1">GPS navigation and route guidance</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </button>
        </div>
      </div>

      {/* Trip Selection */}
      {myTrips.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Select active trip:</label>
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
          {/* Navigation Map */}
          <div className="xl:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Live Navigation</h3>
                <div className="flex items-center space-x-2">
                  <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm">
                    Start Navigation
                  </button>
                  <button className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors text-sm">
                    Recalculate
                  </button>
                </div>
              </div>
              <NavigationMap />
            </div>

            {/* Navigation Instructions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Turn-by-Turn Directions</h3>
              <div className="space-y-3">
                <div className="flex items-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white text-sm font-bold">1</span>
                  </div>
                  <div>
                    <p className="font-medium text-blue-900">Continue straight on Great North Road</p>
                    <p className="text-sm text-blue-700">for 25 km</p>
                  </div>
                </div>
                
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white text-sm font-bold">2</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Turn right at Ndola junction</p>
                    <p className="text-sm text-gray-600">in 20 km</p>
                  </div>
                </div>
                
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white text-sm font-bold">3</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Arrive at Ndola Bus Station</p>
                    <p className="text-sm text-gray-600">destination on the right</p>
                  </div>
                </div>
              </div>
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
                    {format(new Date(activeTripData.departureTime), 'HH:mm')}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">ETA</span>
                  <span className="font-medium text-gray-900">
                    {format(new Date(activeTripData.arrivalTime), 'HH:mm')}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Passengers</span>
                  <span className="font-medium text-gray-900">
                    {activeTripData.bookedSeats.length}/{busData.capacity}
                  </span>
                </div>
              </div>
            </div>

            {/* Route Progress */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <RouteProgress />
            </div>

            {/* Vehicle Status */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Vehicle Status</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Fuel Level</span>
                  <div className="flex items-center">
                    <div className="w-20 h-2 bg-gray-200 rounded-full mr-2">
                      <div 
                        className="h-2 bg-green-500 rounded-full" 
                        style={{ width: `${navigationData.fuelLevel}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{navigationData.fuelLevel}%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Speed</span>
                  <span className="font-medium text-gray-900">{navigationData.speed} km/h</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Engine Status</span>
                  <span className="text-green-600 text-sm">Normal</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Temperature</span>
                  <span className="text-green-600 text-sm">Normal</span>
                </div>
              </div>
            </div>

            {/* Emergency Contacts */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Emergency Contacts</h3>
              <div className="space-y-3">
                <button className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center">
                  <Phone className="w-4 h-4 mr-2" />
                  Emergency Services
                </button>
                <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center">
                  <Phone className="w-4 h-4 mr-2" />
                  Dispatch Center
                </button>
                <button className="w-full bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center">
                  <Phone className="w-4 h-4 mr-2" />
                  Roadside Assistance
                </button>
              </div>
            </div>

            {/* Traffic Alerts */}
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
              <div className="flex items-start">
                <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5 mr-3" />
                <div>
                  <p className="font-medium text-orange-900">Traffic Alert</p>
                  <p className="text-sm text-orange-700 mt-1">
                    Moderate traffic ahead on Great North Road. Consider alternative route.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <Navigation className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Trip</h3>
          <p className="text-gray-600 mb-6">
            You don't have any active trips to navigate at the moment.
          </p>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium">
            View Scheduled Trips
          </button>
        </div>
      )}
    </div>
  );
};

export default DriverNavigation;