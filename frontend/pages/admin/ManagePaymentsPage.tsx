import React, { useMemo, useState } from 'react';
import Button from '../../components/Button';
import Card from '../../components/Card';
import Modal from '../../components/Modal';
import { IconPencil, MOCK_BOOKINGS, MOCK_PAYMENTS, MOCK_PLOTS, MOCK_USERS } from '../../constants';
import { PaymentInstallment, PaymentStatus } from '../../types';

const PAGE_SIZE = 10;

const ManagePaymentsPage: React.FC = () => {
  const [payments, setPayments] = useState<PaymentInstallment[]>(MOCK_PAYMENTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState<PaymentInstallment | null>(null);
  const [paymentFormData, setPaymentFormData] = useState<{ status: PaymentStatus; paidDate?: string; transactionId?: string }>({ status: PaymentStatus.UPCOMING });
  
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [filterBookingId, setFilterBookingId] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);

  // Helper: sort by dueDate descending (latest first)
  const sortByDueDateDesc = (a: PaymentInstallment, b: PaymentInstallment) =>
    new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();

  // Filtered and sorted payments
  const filteredPayments = useMemo(() => {
    return payments.filter(p => {
      const statusMatch = filterStatus ? p.status === filterStatus : true;
      const bookingIdMatch = filterBookingId ? p.bookingId.toLowerCase().includes(filterBookingId.toLowerCase()) : true;
      return statusMatch && bookingIdMatch;
    }).sort(sortByDueDateDesc);
  }, [payments, filterStatus, filterBookingId]);

  // Get latest and first payment (by dueDate) for the current filtered list
  const latestPayment = filteredPayments[0];
  const firstPayment = filteredPayments.length > 1 ? filteredPayments[filteredPayments.length - 1] : undefined;

  // Get remaining payments (excluding latest and first)
  let remainingPayments: PaymentInstallment[] = [];
  if (filteredPayments.length > 2) {
    remainingPayments = filteredPayments.slice(1, filteredPayments.length - 1);
  }

  // Pagination for remaining payments
  const totalPages = Math.ceil(remainingPayments.length / PAGE_SIZE);
  const pagedPayments = remainingPayments.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const getUserAndPlotForBooking = (bookingId: string) => {
    const booking = MOCK_BOOKINGS.find(b => b.id === bookingId);
    if (!booking) return { user: 'N/A', plot: 'N/A' };
    const user = MOCK_USERS.find(u => u.id === booking.userId)?.name || 'Unknown User';
    const plot = MOCK_PLOTS.find(p => p.id === booking.plotId)?.id || 'Unknown Plot';
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
  
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary shadow">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 21v-2a4 4 0 00-3-3.87M9 21v-2a4 4 0 013-3.87" />
            </svg>
          </span>
          <div>
            <h1 className="text-2xl font-bold text-primary mb-1">Manage Payments</h1>
            <div className="text-sm text-neutral-500">Track, update, and manage all payment installments.</div>
          </div>
        </div>
      </div>
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
            <thead className="bg-gradient-to-r from-primary/10 via-white to-primary/10">
              <tr>
                {['Payment ID', 'Booking ID (User, Plot)', 'Schedule', 'Type', 'Amount (₹)', 'Due Date', 'Status', 'Actions', 'Contact'].map(header => (
                  <th key={header} scope="col" className="px-6 py-3 text-left text-xs font-bold text-primary uppercase tracking-wider">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-neutral-100">
              {/* Latest payment row */}
              {latestPayment && (
                <tr key={latestPayment.id} className="hover:bg-primary/5 transition">
                  {/* ...existing code for rendering a payment row... */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-neutral-900">{latestPayment.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                    {latestPayment.bookingId} <br />
                    <span className="text-xs text-neutral-400">({getUserAndPlotForBooking(latestPayment.bookingId).user}, Plot {getUserAndPlotForBooking(latestPayment.bookingId).plot})</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">{latestPayment.scheduleName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">{latestPayment.paymentType}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">₹{latestPayment.amount.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">{new Date(latestPayment.dueDate).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full shadow ${getStatusClass(latestPayment.status)}`}>
                      {latestPayment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Button size="sm" variant="outline" onClick={() => openEditModal(latestPayment)} leftIcon={<IconPencil className="w-4 h-4"/>}>
                      Update
                    </Button>
                  </td>
                  {/* Contact column */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex flex-col gap-2">
                    <button
                      className="flex items-center gap-1 text-green-700 hover:text-green-900 text-xs font-semibold"
                      title="Send WhatsApp Reminder"
                      onClick={() => {
                        const msg = encodeURIComponent(
                          `Dear customer, this is a reminder for your payment (${latestPayment.scheduleName}, ₹${latestPayment.amount.toLocaleString()}). Please complete your payment at the earliest. Thank you!`
                      );
                      window.open(`https://wa.me/?text=${msg}`, "_blank");
                    }}
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.52 3.48A12.07 12.07 0 0012 0C5.37 0 0 5.37 0 12c0 2.11.55 4.16 1.6 5.97L0 24l6.22-1.63A12.07 12.07 0 0012 24c6.63 0 12-5.37 12-12 0-3.21-1.25-6.23-3.48-8.52zM12 22c-1.85 0-3.68-.5-5.25-1.44l-.37-.22-3.69.97.99-3.59-.24-.37A9.94 9.94 0 012 12c0-5.52 4.48-10 10-10s10 4.48 10 10-4.48 10-10 10zm5.2-7.8c-.28-.14-1.65-.81-1.9-.9-.25-.09-.43-.14-.61.14-.18.28-.7.9-.86 1.08-.16.18-.32.2-.6.07-.28-.14-1.18-.43-2.25-1.37-.83-.74-1.39-1.65-1.56-1.93-.16-.28-.02-.43.12-.57.13-.13.28-.34.42-.51.14-.17.18-.29.28-.48.09-.19.05-.36-.02-.5-.07-.14-.61-1.47-.84-2.01-.22-.54-.45-.47-.62-.48-.16-.01-.36-.01-.56-.01s-.5.07-.76.36c-.26.29-1 1.01-1 2.46 0 1.45 1.03 2.85 1.18 3.05.15.2 2.03 3.1 4.93 4.23.69.3 1.23.48 1.65.61.69.22 1.32.19 1.82.12.56-.08 1.65-.67 1.89-1.32.23-.65.23-1.2.16-1.32-.07-.12-.25-.19-.53-.33z"/>
                      </svg>
                      WhatsApp
                    </button>
                    <button
                      className="flex items-center gap-1 text-blue-700 hover:text-blue-900 text-xs font-semibold"
                      title="Call Customer"
                      onClick={() => {
                        alert("Call the customer using their registered phone number.");
                      }}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm0 12a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-2zm12-12a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zm0 12a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h8" />
                      </svg>
                      Call
                    </button>
                  </td>
                </tr>
              )}
              {/* Paged remaining payments */}
              {pagedPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-primary/5 transition">
                  {/* ...existing code for rendering a payment row... */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-neutral-900">{payment.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                    {payment.bookingId} <br />
                    <span className="text-xs text-neutral-400">({getUserAndPlotForBooking(payment.bookingId).user}, Plot {getUserAndPlotForBooking(payment.bookingId).plot})</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">{payment.scheduleName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">{payment.paymentType}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">₹{payment.amount.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">{new Date(payment.dueDate).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full shadow ${getStatusClass(payment.status)}`}>
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Button size="sm" variant="outline" onClick={() => openEditModal(payment)} leftIcon={<IconPencil className="w-4 h-4"/>}>
                      Update
                    </Button>
                  </td>
                  {/* Contact column */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex flex-col gap-2">
                    <button
                      className="flex items-center gap-1 text-green-700 hover:text-green-900 text-xs font-semibold"
                      title="Send WhatsApp Reminder"
                      onClick={() => {
                        const msg = encodeURIComponent(
                          `Dear customer, this is a reminder for your payment (${payment.scheduleName}, ₹${payment.amount.toLocaleString()}). Please complete your payment at the earliest. Thank you!`
                      );
                      window.open(`https://wa.me/?text=${msg}`, "_blank");
                    }}
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.52 3.48A12.07 12.07 0 0012 0C5.37 0 0 5.37 0 12c0 2.11.55 4.16 1.6 5.97L0 24l6.22-1.63A12.07 12.07 0 0012 24c6.63 0 12-5.37 12-12 0-3.21-1.25-6.23-3.48-8.52zM12 22c-1.85 0-3.68-.5-5.25-1.44l-.37-.22-3.69.97.99-3.59-.24-.37A9.94 9.94 0 012 12c0-5.52 4.48-10 10-10s10 4.48 10 10-4.48 10-10 10zm5.2-7.8c-.28-.14-1.65-.81-1.9-.9-.25-.09-.43-.14-.61.14-.18.28-.7.9-.86 1.08-.16.18-.32.2-.6.07-.28-.14-1.18-.43-2.25-1.37-.83-.74-1.39-1.65-1.56-1.93-.16-.28-.02-.43.12-.57.13-.13.28-.34.42-.51.14-.17.18-.29.28-.48.09-.19.05-.36-.02-.5-.07-.14-.61-1.47-.84-2.01-.22-.54-.45-.47-.62-.48-.16-.01-.36-.01-.56-.01s-.5.07-.76.36c-.26.29-1 1.01-1 2.46 0 1.45 1.03 2.85 1.18 3.05.15.2 2.03 3.1 4.93 4.23.69.3 1.23.48 1.65.61.69.22 1.32.19 1.82.12.56-.08 1.65-.67 1.89-1.32.23-.65.23-1.2.16-1.32-.07-.12-.25-.19-.53-.33z"/>
                      </svg>
                      WhatsApp
                    </button>
                    <button
                      className="flex items-center gap-1 text-blue-700 hover:text-blue-900 text-xs font-semibold"
                      title="Call Customer"
                      onClick={() => {
                        alert("Call the customer using their registered phone number.");
                      }}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm0 12a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-2zm12-12a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zm0 12a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h8" />
                      </svg>
                      Call
                    </button>
                  </td>
                </tr>
              ))}
              {/* First payment row (if different from latest) */}
              {firstPayment && firstPayment.id !== latestPayment?.id && (
                <tr key={firstPayment.id} className="hover:bg-primary/5 transition">
                  {/* ...existing code for rendering a payment row... */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-neutral-900">{firstPayment.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                    {firstPayment.bookingId} <br />
                    <span className="text-xs text-neutral-400">({getUserAndPlotForBooking(firstPayment.bookingId).user}, Plot {getUserAndPlotForBooking(firstPayment.bookingId).plot})</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">{firstPayment.scheduleName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">{firstPayment.paymentType}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">₹{firstPayment.amount.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">{new Date(firstPayment.dueDate).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full shadow ${getStatusClass(firstPayment.status)}`}>
                      {firstPayment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Button size="sm" variant="outline" onClick={() => openEditModal(firstPayment)} leftIcon={<IconPencil className="w-4 h-4"/>}>
                      Update
                    </Button>
                  </td>
                  {/* Contact column */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex flex-col gap-2">
                    <button
                      className="flex items-center gap-1 text-green-700 hover:text-green-900 text-xs font-semibold"
                      title="Send WhatsApp Reminder"
                      onClick={() => {
                        const msg = encodeURIComponent(
                          `Dear customer, this is a reminder for your payment (${firstPayment.scheduleName}, ₹${firstPayment.amount.toLocaleString()}). Please complete your payment at the earliest. Thank you!`
                      );
                      window.open(`https://wa.me/?text=${msg}`, "_blank");
                    }}
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.52 3.48A12.07 12.07 0 0012 0C5.37 0 0 5.37 0 12c0 2.11.55 4.16 1.6 5.97L0 24l6.22-1.63A12.07 12.07 0 0012 24c6.63 0 12-5.37 12-12 0-3.21-1.25-6.23-3.48-8.52zM12 22c-1.85 0-3.68-.5-5.25-1.44l-.37-.22-3.69.97.99-3.59-.24-.37A9.94 9.94 0 012 12c0-5.52 4.48-10 10-10s10 4.48 10 10-4.48 10-10 10zm5.2-7.8c-.28-.14-1.65-.81-1.9-.9-.25-.09-.43-.14-.61.14-.18.28-.7.9-.86 1.08-.16.18-.32.2-.6.07-.28-.14-1.18-.43-2.25-1.37-.83-.74-1.39-1.65-1.56-1.93-.16-.28-.02-.43.12-.57.13-.13.28-.34.42-.51.14-.17.18-.29.28-.48.09-.19.05-.36-.02-.5-.07-.14-.61-1.47-.84-2.01-.22-.54-.45-.47-.62-.48-.16-.01-.36-.01-.56-.01s-.5.07-.76.36c-.26.29-1 1.01-1 2.46 0 1.45 1.03 2.85 1.18 3.05.15.2 2.03 3.1 4.93 4.23.69.3 1.23.48 1.65.61.69.22 1.32.19 1.82.12.56-.08 1.65-.67 1.89-1.32.23-.65.23-1.2.16-1.32-.07-.12-.25-.19-.53-.33z"/>
                      </svg>
                      WhatsApp
                    </button>
                    <button
                      className="flex items-center gap-1 text-blue-700 hover:text-blue-900 text-xs font-semibold"
                      title="Call Customer"
                      onClick={() => {
                        alert("Call the customer using their registered phone number.");
                      }}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm0 12a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-2zm12-12a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zm0 12a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h8" />
                      </svg>
                      Call
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {/* Pagination controls for remaining payments */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 py-4">
              <button
                className="px-3 py-1 rounded bg-green-100 text-green-700 font-semibold disabled:opacity-50"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Prev
              </button>
              <span className="text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              <button
                className="px-3 py-1 rounded bg-green-100 text-green-700 font-semibold disabled:opacity-50"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}
          {filteredPayments.length === 0 && (
            <div className="text-center py-10 text-neutral-400 text-lg">
              <svg className="w-16 h-16 mx-auto mb-2 text-primary/20" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2a4 4 0 014-4h4a4 4 0 014 4v2M9 7a4 4 0 11-8 0 4 4 0 018 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 21v-2a4 4 0 00-3-3.87M9 21v-2a4 4 0 013-3.87" />
              </svg>
              No payments match filters.
            </div>
          )}
        </div>
      </Card>
      {editingPayment && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="">
          <div className="max-w-md mx-auto bg-gradient-to-br from-blue-50 via-white to-blue-100 rounded-2xl shadow-2xl p-0">
            <div className="flex items-center justify-between px-8 pt-8 pb-2">
              <h2 className="text-xl font-bold text-primary flex items-center gap-2">
                <IconPencil className="w-5 h-5 text-primary" />
                Update Payment for {editingPayment.id}
              </h2>
            </div>
            <div className="space-y-4 px-8 pb-8 pt-2">
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
          </div>
          <style>{`
            .modal-card-creative {
              background: linear-gradient(135deg, #e0e7ff 0%, #fff 60%, #bae6fd 100%);
              border-radius: 1.5rem;
              box-shadow: 0 8px 32px 0 rgba(31, 41, 55, 0.12);
              animation: pop-in-modal 0.5s cubic-bezier(.68,-0.55,.27,1.55);
            }
            @keyframes pop-in-modal {
              0% { transform: scale(0.95) translateY(40px); opacity: 0.5; }
              100% { transform: scale(1) translateY(0); opacity: 1; }
            }
          `}</style>
        </Modal>
      )}
    </div>
  );
};

export default ManagePaymentsPage;
          
