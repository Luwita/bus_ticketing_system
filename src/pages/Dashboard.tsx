import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import AdminDashboard from './admin/AdminDashboard';
import PassengerDashboard from './passenger/PassengerDashboard';
import DriverDashboard from './driver/DriverDashboard';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  switch (user?.role) {
    case 'admin':
      return <AdminDashboard />;
    case 'passenger':
      return <PassengerDashboard />;
    case 'driver':
      return <DriverDashboard />;
    default:
      return (
        <div className="p-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Access Denied</h1>
            <p className="text-gray-600 mt-2">You don't have permission to access this page.</p>
          </div>
        </div>
      );
  }
};

export default Dashboard;