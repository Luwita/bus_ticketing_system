import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { BarChart3, TrendingUp, Download, Calendar, DollarSign, Users, Bus } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const AdminReports: React.FC = () => {
  const { bookings, trips, routes, buses, users } = useApp();
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  // Sample data for charts
  const monthlyRevenue = [
    { month: 'Jan', revenue: 45000, bookings: 120 },
    { month: 'Feb', revenue: 52000, bookings: 140 },
    { month: 'Mar', revenue: 48000, bookings: 130 },
    { month: 'Apr', revenue: 61000, bookings: 165 },
    { month: 'May', revenue: 55000, bookings: 150 },
    { month: 'Jun', revenue: 67000, bookings: 180 },
  ];

  const routePerformance = [
    { route: 'Lusaka-Ndola', bookings: 45, revenue: 8100 },
    { route: 'Lusaka-Livingstone', bookings: 38, revenue: 8360 },
    { route: 'Ndola-Kitwe', bookings: 52, revenue: 2600 },
    { route: 'Lusaka-Chipata', bookings: 28, revenue: 7000 },
    { route: 'Lusaka-Solwezi', bookings: 22, revenue: 6600 },
  ];

  const busUtilization = [
    { name: 'High Utilization (80-100%)', value: 35, color: '#10B981' },
    { name: 'Medium Utilization (50-79%)', value: 45, color: '#F59E0B' },
    { name: 'Low Utilization (0-49%)', value: 20, color: '#EF4444' },
  ];

  const totalRevenue = bookings
    .filter(b => b.paymentStatus === 'paid')
    .reduce((sum, b) => sum + b.totalAmount, 0);

  const totalPassengers = bookings
    .filter(b => b.status === 'confirmed' || b.status === 'completed')
    .reduce((sum, b) => sum + b.seatNumbers.length, 0);

  const averageOccupancy = trips.length > 0 
    ? trips.reduce((sum, trip) => {
        const bus = buses.find(b => b.id === trip.busId);
        return sum + (bus ? (trip.bookedSeats.length / bus.capacity) * 100 : 0);
      }, 0) / trips.length 
    : 0;

  const topRoutes = routes
    .map(route => {
      const routeTrips = trips.filter(t => t.routeId === route.id);
      const routeBookings = bookings.filter(b => 
        routeTrips.some(t => t.id === b.tripId)
      );
      const revenue = routeBookings
        .filter(b => b.paymentStatus === 'paid')
        .reduce((sum, b) => sum + b.totalAmount, 0);
      
      return {
        ...route,
        totalBookings: routeBookings.length,
        totalRevenue: revenue
      };
    })
    .sort((a, b) => b.totalRevenue - a.totalRevenue)
    .slice(0, 5);

  const handleExportReport = () => {
    const reportData = {
      period: selectedPeriod,
      generatedAt: new Date().toISOString(),
      summary: {
        totalRevenue,
        totalPassengers,
        averageOccupancy: averageOccupancy.toFixed(1),
        activeRoutes: routes.length
      },
      monthlyRevenue,
      routePerformance,
      topRoutes: topRoutes.map(route => ({
        name: route.name,
        bookings: route.totalBookings,
        revenue: route.totalRevenue,
        distance: route.distance
      }))
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `business-report-${selectedPeriod}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600 mt-1">Business insights and performance metrics</p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
          <button 
            onClick={handleExportReport}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">ZMW {totalRevenue.toLocaleString()}</p>
              <p className="text-sm text-green-600 mt-1">+12% from last month</p>
            </div>
            <div className="bg-green-100 p-3 rounded-xl">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Passengers</p>
              <p className="text-2xl font-bold text-gray-900">{totalPassengers}</p>
              <p className="text-sm text-green-600 mt-1">+8% from last month</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-xl">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average Occupancy</p>
              <p className="text-2xl font-bold text-gray-900">{averageOccupancy.toFixed(1)}%</p>
              <p className="text-sm text-orange-600 mt-1">-2% from last month</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-xl">
              <Bus className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Routes</p>
              <p className="text-2xl font-bold text-gray-900">{routes.length}</p>
              <p className="text-sm text-blue-600 mt-1">2 new routes added</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-xl">
              <BarChart3 className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Revenue Trend</h3>
            <div className="flex items-center text-sm text-gray-500">
              <TrendingUp className="w-4 h-4 mr-1" />
              +15% growth
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`ZMW ${value}`, 'Revenue']} />
              <Line type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Bus Utilization */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Bus Utilization</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={busUtilization}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
              >
                {busUtilization.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {busUtilization.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-sm text-gray-600">{item.name}</span>
                </div>
                <span className="text-sm font-medium text-gray-900">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Route Performance */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Route Performance</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={routePerformance}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="route" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="bookings" fill="#3B82F6" name="Bookings" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Top Routes Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Top Performing Routes</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Route</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Distance</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Bookings</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Revenue</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Avg. Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {topRoutes.map((route, index) => (
                <tr key={route.id} className="hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <div>
                      <p className="font-medium text-gray-900">{route.name}</p>
                      <p className="text-sm text-gray-600">{route.source} → {route.destination}</p>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-gray-900">{route.distance} km</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-medium text-gray-900">{route.totalBookings}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-medium text-gray-900">ZMW {route.totalRevenue.toLocaleString()}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-gray-900">
                      ZMW {route.totalBookings > 0 ? Math.round(route.totalRevenue / route.totalBookings) : 0}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminReports;