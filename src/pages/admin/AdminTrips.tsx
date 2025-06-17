import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Calendar, Plus, Search, Filter, Edit, Trash2, Clock, Users, MapPin, Bus } from 'lucide-react';
import { format } from 'date-fns';

const AdminTrips: React.FC = () => {
  const { trips, routes, buses, users, addTrip } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTrip, setEditingTrip] = useState<any>(null);

  const drivers = users.filter(user => user.role === 'driver');

  const filteredTrips = trips.filter(trip => {
    const route = routes.find(r => r.id === trip.routeId);
    const matchesSearch = route ? 
      route.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      route.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
      route.destination.toLowerCase().includes(searchTerm.toLowerCase()) : false;
    const matchesStatus = filterStatus === 'all' || trip.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const tripStats = {
    total: trips.length,
    scheduled: trips.filter(t => t.status === 'scheduled').length,
    inTransit: trips.filter(t => t.status === 'in-transit').length,
    completed: trips.filter(t => t.status === 'arrived').length
  };

  const TripForm = ({ trip, onSave, onCancel }: any) => {
    const [formData, setFormData] = useState({
      routeId: trip?.routeId || '',
      busId: trip?.busId || '',
      driverId: trip?.driverId || '',
      departureTime: trip?.departureTime ? trip.departureTime.slice(0, 16) : '',
      price: trip?.price || 0,
      status: trip?.status || 'scheduled'
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const selectedRoute = routes.find(r => r.id === formData.routeId);
      const selectedBus = buses.find(b => b.id === formData.busId);
      
      if (!selectedRoute || !selectedBus) return;

      const departureDate = new Date(formData.departureTime);
      const arrivalDate = new Date(departureDate.getTime() + selectedRoute.duration * 60000);

      const tripData = {
        ...formData,
        departureTime: departureDate.toISOString(),
        arrivalTime: arrivalDate.toISOString(),
        availableSeats: Array.from({length: selectedBus.capacity}, (_, i) => i + 1),
        bookedSeats: []
      };

      if (trip) {
        // Update trip logic would go here
      } else {
        addTrip(tripData);
      }
      onSave();
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto">
          <h3 className="text-xl font-bold text-gray-900 mb-6">
            {trip ? 'Edit Trip' : 'Schedule New Trip'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Route</label>
              <select
                value={formData.routeId}
                onChange={(e) => setFormData({ ...formData, routeId: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select route</option>
                {routes.map(route => (
                  <option key={route.id} value={route.id}>
                    {route.name} ({route.source} → {route.destination})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bus</label>
              <select
                value={formData.busId}
                onChange={(e) => setFormData({ ...formData, busId: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select bus</option>
                {buses.filter(bus => bus.status === 'active').map(bus => (
                  <option key={bus.id} value={bus.id}>
                    {bus.plateNumber} - {bus.type} ({bus.capacity} seats)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Driver</label>
              <select
                value={formData.driverId}
                onChange={(e) => setFormData({ ...formData, driverId: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select driver</option>
                {drivers.map(driver => (
                  <option key={driver.id} value={driver.id}>{driver.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Departure Time</label>
              <input
                type="datetime-local"
                value={formData.departureTime}
                onChange={(e) => setFormData({ ...formData, departureTime: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price (ZMW)</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="10"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="scheduled">Scheduled</option>
                <option value="boarding">Boarding</option>
                <option value="in-transit">In Transit</option>
                <option value="arrived">Arrived</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                {trip ? 'Update Trip' : 'Schedule Trip'}
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Trip Management</h1>
          <p className="text-gray-600 mt-1">Schedule and manage bus trips</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Schedule Trip
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Trips</p>
              <p className="text-2xl font-bold text-gray-900">{tripStats.total}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-xl">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Scheduled</p>
              <p className="text-2xl font-bold text-gray-900">{tripStats.scheduled}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-xl">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">In Transit</p>
              <p className="text-2xl font-bold text-gray-900">{tripStats.inTransit}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-xl">
              <Bus className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{tripStats.completed}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-xl">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search trips..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="scheduled">Scheduled</option>
                <option value="boarding">Boarding</option>
                <option value="in-transit">In Transit</option>
                <option value="arrived">Arrived</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Trips Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Route</th>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Bus & Driver</th>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Schedule</th>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Passengers</th>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Price</th>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Status</th>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredTrips.map((trip) => {
                const route = routes.find(r => r.id === trip.routeId);
                const bus = buses.find(b => b.id === trip.busId);
                const driver = users.find(u => u.id === trip.driverId);
                
                if (!route || !bus || !driver) return null;

                return (
                  <tr key={trip.id} className="hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-medium text-gray-900">{route.name}</p>
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="w-4 h-4 mr-1" />
                          {route.source} → {route.destination}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-medium text-gray-900">{bus.plateNumber}</p>
                        <p className="text-sm text-gray-600">{driver.name}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-medium text-gray-900">
                          {format(new Date(trip.departureTime), 'MMM dd, HH:mm')}
                        </p>
                        <p className="text-sm text-gray-600">
                          Arrives: {format(new Date(trip.arrivalTime), 'HH:mm')}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center">
                        <Users className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-sm font-medium text-gray-900">
                          {trip.bookedSeats.length}/{bus.capacity}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-medium text-gray-900">ZMW {trip.price}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                        trip.status === 'scheduled' ? 'bg-yellow-100 text-yellow-800' :
                        trip.status === 'boarding' ? 'bg-blue-100 text-blue-800' :
                        trip.status === 'in-transit' ? 'bg-green-100 text-green-800' :
                        trip.status === 'arrived' ? 'bg-purple-100 text-purple-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {trip.status.charAt(0).toUpperCase() + trip.status.slice(1).replace('-', ' ')}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setEditingTrip(trip)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {showAddModal && (
        <TripForm
          onSave={() => setShowAddModal(false)}
          onCancel={() => setShowAddModal(false)}
        />
      )}

      {editingTrip && (
        <TripForm
          trip={editingTrip}
          onSave={() => setEditingTrip(null)}
          onCancel={() => setEditingTrip(null)}
        />
      )}
    </div>
  );
};

export default AdminTrips;