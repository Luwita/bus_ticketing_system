import React from 'react';
import { useApp } from '../../contexts/AppContext';
import { Users, Bus, Route, Ticket, TrendingUp, AlertCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const AdminDashboard: React.FC = () => {
  const { buses, routes, trips, bookings } = useApp();

  const stats = [
    {
      title: 'Total Buses',
      value: buses.length,
      icon: Bus,
      color: 'bg-blue-500',
      change: '+12%'
    },
    {
      title: 'Active Routes',
      value: routes.length,
      icon: Route,
      color: 'bg-green-500',
      change: '+8%'
    },
    {
      title: 'Total Bookings',
      value: bookings.length,
      icon: Ticket,
      color: 'bg-yellow-500',
      change: '+23%'
    },
    {
      title: 'Revenue',
      value: '₦2.4M',
      icon: TrendingUp,
      color: 'bg-purple-500',
      change: '+15%'
    }
  ];

  const monthlyData = [
    { month: 'Jan', bookings: 65, revenue: 1200000 },
    { month: 'Feb', bookings: 59, revenue: 1100000 },
    { month: 'Mar', bookings: 80, revenue: 1500000 },
    { month: 'Apr', bookings: 81, revenue: 1600000 },
    { month: 'May', bookings: 56, revenue: 1000000 },
    { month: 'Jun', bookings: 95, revenue: 1800000 },
  ];

  const routeData = [
    { name: 'Lagos-Abuja', bookings: 35, color: '#3B82F6' },
    { name: 'Accra-Kumasi', bookings: 25, color: '#10B981' },
    { name: 'Other Routes', bookings: 40, color: '#F59E0B' },
  ];

  const recentBookings = [
    { id: '1', passenger: 'John Doe', route: 'Lagos - Abuja', date: '2024-02-01', status: 'confirmed' },
    { id: '2', passenger: 'Jane Smith', route: 'Accra - Kumasi', date: '2024-02-01', status: 'pending' },
    { id: '3', passenger: 'Mike Johnson', route: 'Lagos - Abuja', date: '2024-02-02', status: 'confirmed' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <div className="flex items-center space-x-3">
          <div className="flex items-center text-sm text-gray-500">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
            System Status: Online
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <p className="text-sm text-green-600 mt-1">{stat.change} from last month</p>
                </div>
                <div className={`${stat.color} p-3 rounded-xl`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Monthly Bookings Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Monthly Bookings & Revenue</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="bookings" fill="#3B82F6" name="Bookings" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Route Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Popular Routes</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={routeData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="bookings"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {routeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Recent Bookings</h3>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">View All</button>
          </div>
          <div className="space-y-4">
            {recentBookings.map((booking) => (
              <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{booking.passenger}</p>
                  <p className="text-sm text-gray-600">{booking.route}</p>
                  <p className="text-xs text-gray-500">{booking.date}</p>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  booking.status === 'confirmed' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {booking.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* System Alerts */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">System Alerts</h3>
            <AlertCircle className="w-5 h-5 text-orange-500" />
          </div>
          <div className="space-y-4">
            <div className="flex items-start space-x-3 p-4 bg-orange-50 rounded-lg border border-orange-200">
              <AlertCircle className="w-5 h-5 text-orange-500 mt-0.5" />
              <div>
                <p className="font-medium text-orange-900">Bus Maintenance Due</p>
                <p className="text-sm text-orange-700">Bus ABC-123 is due for maintenance check</p>
                <p className="text-xs text-orange-600 mt-1">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5" />
              <div>
                <p className="font-medium text-blue-900">New Driver Registration</p>
                <p className="text-sm text-blue-700">New driver application requires approval</p>
                <p className="text-xs text-blue-600 mt-1">4 hours ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-4 bg-green-50 rounded-lg border border-green-200">
              <AlertCircle className="w-5 h-5 text-green-500 mt-0.5" />
              <div>
                <p className="font-medium text-green-900">System Update Complete</p>
                <p className="text-sm text-green-700">Payment gateway update deployed successfully</p>
                <p className="text-xs text-green-600 mt-1">1 day ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;