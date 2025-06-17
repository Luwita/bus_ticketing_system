import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import { CreditCard, Download, Filter, Search, CheckCircle, XCircle, Clock, Plus } from 'lucide-react';
import { format } from 'date-fns';

const PassengerPayments: React.FC = () => {
  const { bookings, trips, routes } = useApp();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddPaymentMethod, setShowAddPaymentMethod] = useState(false);

  const myBookings = bookings.filter(booking => booking.passengerId === user?.id);

  // Create payment records from bookings
  const payments = myBookings.map(booking => {
    const trip = trips.find(t => t.id === booking.tripId);
    const route = trip ? routes.find(r => r.id === trip.routeId) : null;
    
    return {
      id: `PAY-${booking.id}`,
      bookingId: booking.id,
      qrCode: booking.qrCode,
      amount: booking.totalAmount,
      status: booking.paymentStatus,
      method: 'Mobile Money', // Mock payment method
      date: booking.bookingDate,
      route: route ? `${route.source} → ${route.destination}` : 'Unknown Route',
      transactionId: `TXN-${Date.now()}-${booking.id.slice(-4)}`
    };
  });

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.qrCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.route.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || payment.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const paymentStats = {
    total: payments.length,
    paid: payments.filter(p => p.status === 'paid').length,
    pending: payments.filter(p => p.status === 'pending').length,
    failed: payments.filter(p => p.status === 'failed').length,
    totalAmount: payments
      .filter(p => p.status === 'paid')
      .reduce((sum, p) => sum + p.amount, 0)
  };

  const handleExportHistory = () => {
    const csvContent = [
      ['Date', 'Transaction ID', 'Route', 'Amount (ZMW)', 'Status', 'Method'],
      ...filteredPayments.map(payment => [
        format(new Date(payment.date), 'yyyy-MM-dd'),
        payment.transactionId,
        payment.route,
        payment.amount.toString(),
        payment.status,
        payment.method
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payment-history-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const AddPaymentMethodModal = () => {
    const [paymentType, setPaymentType] = useState('mobile-money');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [provider, setProvider] = useState('mtn');

    const handleAddPaymentMethod = () => {
      // Mock adding payment method
      alert(`Payment method added: ${provider.toUpperCase()} - ${phoneNumber}`);
      setShowAddPaymentMethod(false);
      setPhoneNumber('');
    };

    if (!showAddPaymentMethod) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 w-full max-w-md">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Add Payment Method</h3>
            <button
              onClick={() => setShowAddPaymentMethod(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Payment Type</label>
              <select
                value={paymentType}
                onChange={(e) => setPaymentType(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="mobile-money">Mobile Money</option>
                <option value="bank-card">Bank Card</option>
              </select>
            </div>

            {paymentType === 'mobile-money' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Provider</label>
                  <select
                    value={provider}
                    onChange={(e) => setProvider(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="mtn">MTN Mobile Money</option>
                    <option value="airtel">Airtel Money</option>
                    <option value="zamtel">Zamtel Kwacha</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+260 977 123 456"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </>
            )}

            <div className="flex space-x-3 pt-4">
              <button
                onClick={handleAddPaymentMethod}
                className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Add Payment Method
              </button>
              <button
                onClick={() => setShowAddPaymentMethod(false)}
                className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const PaymentCard = ({ payment }: { payment: any }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className={`p-3 rounded-xl ${
            payment.status === 'paid' ? 'bg-green-100' :
            payment.status === 'pending' ? 'bg-yellow-100' :
            'bg-red-100'
          }`}>
            {payment.status === 'paid' ? (
              <CheckCircle className="w-6 h-6 text-green-600" />
            ) : payment.status === 'pending' ? (
              <Clock className="w-6 h-6 text-yellow-600" />
            ) : (
              <XCircle className="w-6 h-6 text-red-600" />
            )}
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-semibold text-gray-900">ZMW {payment.amount.toLocaleString()}</h3>
            <p className="text-sm text-gray-600">{payment.route}</p>
          </div>
        </div>
        <span className={`px-3 py-1 text-xs font-medium rounded-full ${
          payment.status === 'paid' ? 'bg-green-100 text-green-800' :
          payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-600">Transaction ID</p>
          <p className="font-medium text-gray-900">{payment.transactionId}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Payment Method</p>
          <p className="font-medium text-gray-900">{payment.method}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Date</p>
          <p className="font-medium text-gray-900">
            {format(new Date(payment.date), 'MMM dd, yyyy HH:mm')}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div>
          <p className="text-sm text-gray-600">Booking Reference</p>
          <p className="font-medium text-gray-900">{payment.qrCode}</p>
        </div>
        <div className="flex items-center space-x-2">
          {payment.status === 'paid' && (
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center text-sm">
              <Download className="w-4 h-4 mr-2" />
              Receipt
            </button>
          )}
          {payment.status === 'failed' && (
            <button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors text-sm">
              Retry Payment
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Payment History</h1>
          <p className="text-gray-600 mt-1">View and manage your payment transactions</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Payments</p>
              <p className="text-2xl font-bold text-gray-900">{paymentStats.total}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-xl">
              <CreditCard className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Successful</p>
              <p className="text-2xl font-bold text-gray-900">{paymentStats.paid}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-xl">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">{paymentStats.pending}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-xl">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Failed</p>
              <p className="text-2xl font-bold text-gray-900">{paymentStats.failed}</p>
            </div>
            <div className="bg-red-100 p-3 rounded-xl">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Spent</p>
              <p className="text-2xl font-bold text-gray-900">ZMW {paymentStats.totalAmount.toLocaleString()}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-xl">
              <CreditCard className="w-6 h-6 text-purple-600" />
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
                placeholder="Search payments..."
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
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          </div>
          <button 
            onClick={handleExportHistory}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <Download className="w-4 h-4 mr-2" />
            Export History
          </button>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Saved Payment Methods</h3>
          <button 
            onClick={() => setShowAddPaymentMethod(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center text-sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Method
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-green-600">MTN</span>
                </div>
                <span className="ml-3 font-medium text-gray-900">MTN Mobile Money</span>
              </div>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Primary</span>
            </div>
            <p className="text-sm text-gray-600">+260 977 *** 456</p>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-red-600">AIR</span>
                </div>
                <span className="ml-3 font-medium text-gray-900">Airtel Money</span>
              </div>
            </div>
            <p className="text-sm text-gray-600">+260 966 *** 012</p>
          </div>
          
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center hover:border-blue-400 transition-colors cursor-pointer"
               onClick={() => setShowAddPaymentMethod(true)}>
            <div className="text-center">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Plus className="w-4 h-4 text-gray-400" />
              </div>
              <span className="text-sm text-gray-600">Add Payment Method</span>
            </div>
          </div>
        </div>
      </div>

      {/* Payments List */}
      <div className="space-y-4">
        {filteredPayments.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No payments found</h3>
            <p className="text-gray-600 mb-6">You haven't made any payments yet or no payments match your filter.</p>
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium">
              Book a Trip
            </button>
          </div>
        ) : (
          filteredPayments.map((payment) => (
            <PaymentCard key={payment.id} payment={payment} />
          ))
        )}
      </div>

      {/* Add Payment Method Modal */}
      <AddPaymentMethodModal />
    </div>
  );
};

export default PassengerPayments;