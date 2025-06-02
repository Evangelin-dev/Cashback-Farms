
import React, { useState, useMemo } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import { MOCK_PAYMENTS, MOCK_BOOKINGS, MOCK_PLOTS, MOCK_USERS, IconPencil } from '../../constants';
import { PaymentInstallment, PaymentStatus, PaymentType } from '../../types';

const ManagePaymentsPage: React.FC = () => {
  const [payments, setPayments] = useState<PaymentInstallment[]>(MOCK_PAYMENTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState<PaymentInstallment | null>(null);
  const [paymentFormData, setPaymentFormData] = useState<{ status: PaymentStatus; paidDate?: string; transactionId?: string }>({ status: PaymentStatus.UPCOMING });
  
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [filterBookingId, setFilterBookingId] = useState<string>('');

  const getUserAndPlotForBooking = (bookingId: string) => {
    const booking = MOCK_BOOKINGS.find(b => b.id === bookingId);
    if (!booking) return { user: 'N/A', plot: 'N/A' };
    const user = MOCK_USERS.find(u => u.id === booking.userId)?.name || 'Unknown User';
    const plot = MOCK_PLOTS.find(p => p.id === booking.plotId)?.plotNo || 'Unknown Plot';
    return { user, plot };
  };
  
  const openEditModal = (payment: PaymentInstallment) => {
    setEditingPayment(payment);
    setPaymentFormData({ 
      status: payment.status, 
      paidDate: payment.paidDate || (payment.status === PaymentStatus.PAID ? new Date().toISOString().split('T')[0] : ''),
      transactionId: payment.transactionId || '' 
    });
    setIsModalOpen(true);
  };

  const handleFormInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPaymentFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = () => {
    if (editingPayment) {
      const updatedPayments = payments.map(p =>
        p.id === editingPayment.id
          ? { ...p, ...paymentFormData, paidDate: paymentFormData.status === PaymentStatus.PAID ? (paymentFormData.paidDate || new Date().toISOString().split('T')[0]) : undefined }
          : p
      );
      setPayments(updatedPayments);
      // Also update the MOCK_PAYMENTS for persistence in this mock setup
      const mockIndex = MOCK_PAYMENTS.findIndex(p => p.id === editingPayment.id);
      if (mockIndex !== -1) {
        MOCK_PAYMENTS[mockIndex] = { ...MOCK_PAYMENTS[mockIndex], ...paymentFormData, paidDate: paymentFormData.status === PaymentStatus.PAID ? (paymentFormData.paidDate || new Date().toISOString().split('T')[0]) : undefined };
      }
      setIsModalOpen(false);
      setEditingPayment(null);
    }
  };

  const getStatusClass = (status: PaymentStatus): string => {
    switch (status) {
      case PaymentStatus.PAID: return 'bg-green-100 text-green-800';
      case PaymentStatus.DUE: return 'bg-yellow-100 text-yellow-800';
      case PaymentStatus.OVERDUE: return 'bg-red-100 text-red-800';
      case PaymentStatus.PENDING: return 'bg-orange-100 text-orange-800'; // For pending advances
      case PaymentStatus.UPCOMING: return 'bg-blue-100 text-blue-800';
      default: return 'bg-neutral-100 text-neutral-800';
    }
  };
  
  const filteredPayments = useMemo(() => {
    return payments.filter(p => {
      const statusMatch = filterStatus ? p.status === filterStatus : true;
      const bookingIdMatch = filterBookingId ? p.bookingId.toLowerCase().includes(filterBookingId.toLowerCase()) : true;
      return statusMatch && bookingIdMatch;
    });
  }, [payments, filterStatus, filterBookingId]);


  return (
    <div>
      <h1 className="text-2xl font-semibold text-neutral-800 mb-6">Manage Payments</h1>

      <Card className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
          <div>
            <label htmlFor="filterStatus" className="block text-sm font-medium text-neutral-700">Filter by Status</label>
            <select 
              id="filterStatus" 
              value={filterStatus} 
              onChange={(e) => setFilterStatus(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-neutral-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            >
              <option value="">All Statuses</option>
              {Object.values(PaymentStatus).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="filterBookingId" className="block text-sm font-medium text-neutral-700">Filter by Booking ID</label>
            <input 
              type="text"
              id="filterBookingId"
              placeholder="Enter Booking ID"
              value={filterBookingId}
              onChange={(e) => setFilterBookingId(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            />
          </div>
        </div>
      </Card>
      
      <Card bodyClassName="p-0">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-neutral-200">
            <thead className="bg-neutral-50">
              <tr>
                {['Payment ID', 'Booking ID (User, Plot)', 'Schedule', 'Type', 'Amount (₹)', 'Due Date', 'Status', 'Actions'].map(header => (
                  <th key={header} scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-neutral-200">
              {filteredPayments.map((payment) => {
                const {user, plot} = getUserAndPlotForBooking(payment.bookingId);
                return (
                <tr key={payment.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-900">{payment.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                    {payment.bookingId} <br />
                    <span className="text-xs text-neutral-400">({user}, Plot {plot})</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">{payment.scheduleName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">{payment.paymentType}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">₹{payment.amount.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">{new Date(payment.dueDate).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(payment.status)}`}>
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Button size="sm" variant="outline" onClick={() => openEditModal(payment)} leftIcon={<IconPencil className="w-4 h-4"/>}>
                      Update
                    </Button>
                  </td>
                </tr>
              )})}
            </tbody>
          </table>
          {filteredPayments.length === 0 && <p className="text-center py-4 text-neutral-500">No payments match filters.</p>}
        </div>
      </Card>

      {editingPayment && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`Update Payment for ${editingPayment.id}`}>
          <div className="space-y-4">
            <div>
              <label htmlFor="paymentStatus" className="block text-sm font-medium text-neutral-700">Payment Status</label>
              <select 
                id="paymentStatus" 
                name="status"
                value={paymentFormData.status} 
                onChange={handleFormInputChange}
                className="mt-1 block w-full px-3 py-2 border border-neutral-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              >
                {Object.values(PaymentStatus).map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
            {paymentFormData.status === PaymentStatus.PAID && (
              <>
                <div>
                  <label htmlFor="paidDate" className="block text-sm font-medium text-neutral-700">Paid Date</label>
                  <input type="date" name="paidDate" id="paidDate" value={paymentFormData.paidDate} onChange={handleFormInputChange} 
                         className="mt-1 block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                </div>
                <div>
                  <label htmlFor="transactionId" className="block text-sm font-medium text-neutral-700">Transaction ID (Optional)</label>
                  <input type="text" name="transactionId" id="transactionId" value={paymentFormData.transactionId} onChange={handleFormInputChange} 
                         className="mt-1 block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                </div>
              </>
            )}
            <div className="flex justify-end space-x-3 pt-2">
              <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button variant="primary" onClick={handleSaveChanges}>Save Changes</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ManagePaymentsPage;
