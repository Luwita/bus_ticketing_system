import React, { ReactNode } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import AdminLayout from '../admin/AdminLayout';
import PassengerLayout from '../passenger/PassengerLayout';
import DriverLayout from '../driver/DriverLayout';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    return <div className="min-h-screen bg-gray-50">{children}</div>;
  }

  switch (user.role) {
    case 'admin':
      return <AdminLayout>{children}</AdminLayout>;
    case 'passenger':
      return <PassengerLayout>{children}</PassengerLayout>;
    case 'driver':
      return <DriverLayout>{children}</DriverLayout>;
    default:
      return <div className="min-h-screen bg-gray-50">{children}</div>;
  }
};

export default Layout;