import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Route as RouteIcon, Plus, Search, Edit, Trash2, MapPin, Clock, DollarSign } from 'lucide-react';

const AdminRoutes: React.FC = () => {
  const { routes, addRoute } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingRoute, setEditingRoute] = useState<any>(null);

  const filteredRoutes = routes.filter(route => 
    route.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    route.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
    route.destination.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteRoute = (routeId: string) => {
    if (window.confirm('Are you sure you want to delete this route? This action cannot be undone.')) {
      // Mock delete functionality
      alert(`Route ${routeId} would be deleted from the system.`);
    }
  };

  const RouteForm = ({ route, onSave, onCancel }: any) => {
    const [formData, setFormData] = useState({
      name: route?.name || '',
      source: route?.source || '',
      destination: route?.destination || '',
      stops: route?.stops || [],
      duration: route?.duration || 0,
      distance: route?.distance || 0,
      basePrice: route?.basePrice || 0
    });

    const [newStop, setNewStop] = useState('');

    const zambianCities = [
      'Lusaka', 'Ndola', 'Kitwe', 'Livingstone', 'Chipata', 'Solwezi', 
      'Kabwe', 'Chingola', 'Mufulira', 'Luanshya', 'Kasama', 'Mazabuka',
      'Monze', 'Choma', 'Kapiri Mposhi', 'Mumbwa', 'Kaoma', 'Kasempa',
      'Nyimba', 'Petauke', 'Mansa', 'Kawambwa', 'Nchelenge', 'Mporokoso',
      'Samfya', 'Serenje', 'Mkushi', 'Mpika', 'Isoka', 'Nakonde'
    ];

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (route) {
        // Update route logic would go here
        alert('Route updated successfully!');
      } else {
        addRoute(formData);
        alert('Route added successfully!');
      }
      onSave();
    };

    const addStop = () => {
      if (newStop.trim() && !formData.stops.includes(newStop.trim())) {
        setFormData({
          ...formData,
          stops: [...formData.stops, newStop.trim()]
        });
        setNewStop('');
      }
    };

    const removeStop = (stop: string) => {
      setFormData({
        ...formData,
        stops: formData.stops.filter(s => s !== stop)
      });
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <h3 className="text-xl font-bold text-gray-900 mb-6">
            {route ? 'Edit Route' : 'Add New Route'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Route Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Lusaka - Ndola Express"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Source City</label>
                <select
                  value={formData.source}
                  onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select source city</option>
                  {zambianCities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Destination City</label>
                <select
                  value={formData.destination}
                  onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select destination city</option>
                  {zambianCities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Stops</label>
              <div className="flex space-x-2 mb-2">
                <select
                  value={newStop}
                  onChange={(e) => setNewStop(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select a stop</option>
                  {zambianCities.filter(city => 
                    city !== formData.source && 
                    city !== formData.destination && 
                    !formData.stops.includes(city)
                  ).map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={addStop}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Stop
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.stops.map((stop, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center"
                  >
                    {stop}
                    <button
                      type="button"
                      onClick={() => removeStop(stop)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Duration (minutes)</label>
                <input
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="30"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Distance (km)</label>
                <input
                  type="number"
                  value={formData.distance}
                  onChange={(e) => setFormData({ ...formData, distance: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="10"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Base Price (ZMW)</label>
                <input
                  type="number"
                  value={formData.basePrice}
                  onChange={(e) => setFormData({ ...formData, basePrice: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="10"
                  required
                />
              </div>
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                {route ? 'Update Route' : 'Add Route'}
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
          <h1 className="text-3xl font-bold text-gray-900">Route Management</h1>
          <p className="text-gray-600 mt-1">Manage bus routes across Zambia</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Route
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search routes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Routes Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredRoutes.map((route) => (
          <div key={route.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="bg-blue-100 p-3 rounded-xl">
                  <RouteIcon className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">{route.name}</h3>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-1" />
                    {route.source} → {route.destination}
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setEditingRoute(route)}
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDeleteRoute(route.id)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Distance</span>
                <span className="text-sm font-medium text-gray-900">{route.distance} km</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Duration</span>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 text-gray-400 mr-1" />
                  <span className="text-sm font-medium text-gray-900">
                    {Math.floor(route.duration / 60)}h {route.duration % 60}m
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Base Price</span>
                <div className="flex items-center">
                  <DollarSign className="w-4 h-4 text-gray-400 mr-1" />
                  <span className="text-sm font-medium text-gray-900">ZMW {route.basePrice.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {route.stops.length > 0 && (
              <div>
                <p className="text-sm text-gray-600 mb-2">Stops</p>
                <div className="flex flex-wrap gap-1">
                  {route.stops.map((stop, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                    >
                      {stop}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modals */}
      {showAddModal && (
        <RouteForm
          onSave={() => setShowAddModal(false)}
          onCancel={() => setShowAddModal(false)}
        />
      )}

      {editingRoute && (
        <RouteForm
          route={editingRoute}
          onSave={() => setEditingRoute(null)}
          onCancel={() => setEditingRoute(null)}
        />
      )}
    </div>
  );
};

export default AdminRoutes;