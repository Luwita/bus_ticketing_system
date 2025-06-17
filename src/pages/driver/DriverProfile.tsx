import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { User, Mail, Phone, Calendar, MapPin, Award, Clock, Save, Edit, Star } from 'lucide-react';
import { format } from 'date-fns';

const DriverProfile: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    dateOfBirth: '1985-03-15',
    address: 'Lusaka, Zambia',
    licenseNumber: 'DL123456789',
    licenseExpiry: '2026-03-15',
    emergencyContact: '+260 977 654321',
    emergencyName: 'Mary Phiri'
  });

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'performance', name: 'Performance', icon: Award },
    { id: 'schedule', name: 'Schedule', icon: Calendar },
    { id: 'documents', name: 'Documents', icon: MapPin },
  ];

  // Mock performance data
  const performanceStats = {
    totalTrips: 156,
    totalDistance: 12450,
    averageRating: 4.8,
    onTimePercentage: 94,
    safetyScore: 98,
    fuelEfficiency: 8.5
  };

  const recentTrips = [
    { date: '2024-02-15', route: 'Lusaka - Ndola', rating: 5, passengers: 45 },
    { date: '2024-02-14', route: 'Ndola - Kitwe', rating: 4.8, passengers: 38 },
    { date: '2024-02-13', route: 'Lusaka - Livingstone', rating: 4.9, passengers: 42 },
    { date: '2024-02-12', route: 'Livingstone - Lusaka', rating: 5, passengers: 40 },
  ];

  const upcomingTrips = [
    { date: '2024-02-16', time: '06:00', route: 'Lusaka - Chipata', bus: 'ACB 1234' },
    { date: '2024-02-17', time: '08:00', route: 'Chipata - Lusaka', bus: 'ACB 1234' },
    { date: '2024-02-18', time: '14:00', route: 'Lusaka - Solwezi', bus: 'ACD 5678' },
  ];

  const handleSave = () => {
    // Save logic would go here
    setIsEditing(false);
  };

  const ProfileTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="text-blue-600 hover:text-blue-700 font-medium flex items-center"
        >
          <Edit className="w-4 h-4 mr-2" />
          {isEditing ? 'Cancel' : 'Edit'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            disabled={!isEditing}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            disabled={!isEditing}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            disabled={!isEditing}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
          <input
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
            disabled={!isEditing}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
          />
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
          <input
            type="text"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            disabled={!isEditing}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
          />
        </div>
      </div>

      <div>
        <h4 className="text-md font-semibold text-gray-900 mb-4">License Information</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">License Number</label>
            <input
              type="text"
              value={formData.licenseNumber}
              onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
              disabled={!isEditing}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">License Expiry</label>
            <input
              type="date"
              value={formData.licenseExpiry}
              onChange={(e) => setFormData({ ...formData, licenseExpiry: e.target.value })}
              disabled={!isEditing}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
            />
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-md font-semibold text-gray-900 mb-4">Emergency Contact</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Contact Name</label>
            <input
              type="text"
              value={formData.emergencyName}
              onChange={(e) => setFormData({ ...formData, emergencyName: e.target.value })}
              disabled={!isEditing}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Contact Phone</label>
            <input
              type="tel"
              value={formData.emergencyContact}
              onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
              disabled={!isEditing}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
            />
          </div>
        </div>
      </div>

      {isEditing && (
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </button>
        </div>
      )}
    </div>
  );

  const PerformanceTab = () => (
    <div className="space-y-6">
      {/* Performance Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-50 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Total Trips</p>
              <p className="text-2xl font-bold text-blue-900">{performanceStats.totalTrips}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-xl">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-green-50 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Average Rating</p>
              <div className="flex items-center">
                <p className="text-2xl font-bold text-green-900">{performanceStats.averageRating}</p>
                <Star className="w-5 h-5 text-yellow-500 ml-1" />
              </div>
            </div>
            <div className="bg-green-100 p-3 rounded-xl">
              <Award className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-purple-50 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">On-Time %</p>
              <p className="text-2xl font-bold text-purple-900">{performanceStats.onTimePercentage}%</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-xl">
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h4 className="font-semibold text-gray-900 mb-2">Total Distance</h4>
          <p className="text-2xl font-bold text-gray-900">{performanceStats.totalDistance.toLocaleString()} km</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h4 className="font-semibold text-gray-900 mb-2">Safety Score</h4>
          <p className="text-2xl font-bold text-green-600">{performanceStats.safetyScore}%</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h4 className="font-semibold text-gray-900 mb-2">Fuel Efficiency</h4>
          <p className="text-2xl font-bold text-blue-600">{performanceStats.fuelEfficiency} km/L</p>
        </div>
      </div>

      {/* Recent Trips */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Trip Performance</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Date</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Route</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Passengers</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentTrips.map((trip, index) => (
                <tr key={index}>
                  <td className="py-3 px-4">{format(new Date(trip.date), 'MMM dd, yyyy')}</td>
                  <td className="py-3 px-4">{trip.route}</td>
                  <td className="py-3 px-4">{trip.passengers}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-500 mr-1" />
                      <span>{trip.rating}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const ScheduleTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Trips</h3>
        <div className="space-y-4">
          {upcomingTrips.map((trip, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className="bg-blue-100 p-3 rounded-xl">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <h4 className="font-medium text-gray-900">{trip.route}</h4>
                  <p className="text-sm text-gray-600">
                    {format(new Date(trip.date), 'MMM dd, yyyy')} at {trip.time}
                  </p>
                  <p className="text-sm text-gray-600">Bus: {trip.bus}</p>
                </div>
              </div>
              <button className="text-blue-600 hover:text-blue-700 font-medium">
                View Details
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Schedule Preferences</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Working Hours</label>
            <div className="grid grid-cols-2 gap-4">
              <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option>06:00 AM</option>
                <option>07:00 AM</option>
                <option>08:00 AM</option>
              </select>
              <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option>06:00 PM</option>
                <option>07:00 PM</option>
                <option>08:00 PM</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Routes</label>
            <div className="space-y-2">
              {['Lusaka - Ndola', 'Lusaka - Livingstone', 'Lusaka - Chipata'].map((route, index) => (
                <div key={index} className="flex items-center">
                  <input type="checkbox" defaultChecked className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                  <label className="ml-3 text-sm text-gray-700">{route}</label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const DocumentsTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Required Documents</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-bold">✓</span>
              </div>
              <div className="ml-4">
                <h4 className="font-medium text-green-900">Driver's License</h4>
                <p className="text-sm text-green-700">Valid until {format(new Date(formData.licenseExpiry), 'MMM dd, yyyy')}</p>
              </div>
            </div>
            <button className="text-green-600 hover:text-green-700 font-medium">View</button>
          </div>

          <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-bold">✓</span>
              </div>
              <div className="ml-4">
                <h4 className="font-medium text-green-900">Medical Certificate</h4>
                <p className="text-sm text-green-700">Valid until Dec 15, 2024</p>
              </div>
            </div>
            <button className="text-green-600 hover:text-green-700 font-medium">View</button>
          </div>

          <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                <span className="text-yellow-600 font-bold">!</span>
              </div>
              <div className="ml-4">
                <h4 className="font-medium text-yellow-900">Background Check</h4>
                <p className="text-sm text-yellow-700">Expires in 30 days</p>
              </div>
            </div>
            <button className="text-yellow-600 hover:text-yellow-700 font-medium">Renew</button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload New Document</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Document Type</label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option>Select document type</option>
              <option>Driver's License</option>
              <option>Medical Certificate</option>
              <option>Background Check</option>
              <option>Insurance Certificate</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Upload File</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
              <p className="text-gray-600">Drag and drop your file here, or click to browse</p>
              <p className="text-sm text-gray-500 mt-1">PDF, JPG, PNG up to 10MB</p>
            </div>
          </div>

          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
            Upload Document
          </button>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileTab />;
      case 'performance':
        return <PerformanceTab />;
      case 'schedule':
        return <ScheduleTab />;
      case 'documents':
        return <DocumentsTab />;
      default:
        return <ProfileTab />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Driver Profile</h1>
          <p className="text-gray-600 mt-1">Manage your profile and view performance metrics</p>
        </div>
      </div>

      {/* Profile Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-2xl font-bold text-blue-600">
              {user?.name.charAt(0)}
            </span>
          </div>
          <div className="ml-6">
            <h2 className="text-2xl font-bold text-gray-900">{user?.name}</h2>
            <p className="text-gray-600">Professional Driver</p>
            <div className="flex items-center mt-2 space-x-4">
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="w-4 h-4 mr-1" />
                Driver since {user ? format(new Date(user.createdAt), 'MMM yyyy') : ''}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Star className="w-4 h-4 mr-1 text-yellow-500" />
                {performanceStats.averageRating} rating
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="w-4 h-4 mr-1" />
                Lusaka, Zambia
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs and Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default DriverProfile;