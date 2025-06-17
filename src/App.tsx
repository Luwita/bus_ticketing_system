import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AppProvider } from './contexts/AppContext';
import Layout from './components/common/Layout';
import Login from './components/auth/Login';
import Dashboard from './pages/Dashboard';

// Admin Pages
import AdminUsers from './pages/admin/AdminUsers';
import AdminBuses from './pages/admin/AdminBuses';
import AdminRoutes from './pages/admin/AdminRoutes';
import AdminTrips from './pages/admin/AdminTrips';
import AdminBookings from './pages/admin/AdminBookings';
import AdminReports from './pages/admin/AdminReports';
import AdminSettings from './pages/admin/AdminSettings';

// Passenger Pages
import PassengerBookings from './pages/passenger/PassengerBookings';
import PassengerTrack from './pages/passenger/PassengerTrack';
import PassengerPayments from './pages/passenger/PassengerPayments';
import PassengerProfile from './pages/passenger/PassengerProfile';

// Driver Pages
import DriverNavigation from './pages/driver/DriverNavigation';
import DriverCheckin from './pages/driver/DriverCheckin';
import DriverMessages from './pages/driver/DriverMessages';
import DriverProfile from './pages/driver/DriverProfile';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            } />
            
            {/* Admin Routes */}
            <Route path="/admin/users" element={
              <ProtectedRoute>
                <Layout>
                  <AdminUsers />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/admin/buses" element={
              <ProtectedRoute>
                <Layout>
                  <AdminBuses />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/admin/routes" element={
              <ProtectedRoute>
                <Layout>
                  <AdminRoutes />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/admin/trips" element={
              <ProtectedRoute>
                <Layout>
                  <AdminTrips />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/admin/bookings" element={
              <ProtectedRoute>
                <Layout>
                  <AdminBookings />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/admin/reports" element={
              <ProtectedRoute>
                <Layout>
                  <AdminReports />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/admin/settings" element={
              <ProtectedRoute>
                <Layout>
                  <AdminSettings />
                </Layout>
              </ProtectedRoute>
            } />

            {/* Passenger Routes */}
            <Route path="/passenger/bookings" element={
              <ProtectedRoute>
                <Layout>
                  <PassengerBookings />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/passenger/track" element={
              <ProtectedRoute>
                <Layout>
                  <PassengerTrack />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/passenger/payments" element={
              <ProtectedRoute>
                <Layout>
                  <PassengerPayments />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/passenger/profile" element={
              <ProtectedRoute>
                <Layout>
                  <PassengerProfile />
                </Layout>
              </ProtectedRoute>
            } />

            {/* Driver Routes */}
            <Route path="/driver/navigation" element={
              <ProtectedRoute>
                <Layout>
                  <DriverNavigation />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/driver/checkin" element={
              <ProtectedRoute>
                <Layout>
                  <DriverCheckin />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/driver/messages" element={
              <ProtectedRoute>
                <Layout>
                  <DriverMessages />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/driver/profile" element={
              <ProtectedRoute>
                <Layout>
                  <DriverProfile />
                </Layout>
              </ProtectedRoute>
            } />

            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Router>
      </AppProvider>
    </AuthProvider>
  );
};

export default App;