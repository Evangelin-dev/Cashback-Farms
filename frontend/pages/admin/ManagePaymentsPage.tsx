import React, { useEffect, useMemo, useState } from 'react';
import Button from '../../components/Button';
import Card from '../../components/Card';
import Modal from '../../components/Modal';
import { IconPencil } from '../../constants';
import apiClient from '../../src/utils/api/apiClient';
import { message } from 'antd';

const PAGE_SIZE = 10;

interface IPayment {
  id: number;
  plot_id: number;
  razorpay_order_id: string;
  razorpay_payment_id: string | null;
  amount: number;
  status: 'created' | 'paid' | 'failed';
  created_at: string;
  user: number;
}

enum PaymentStatus {
  PAID = 'paid',
  CREATED = 'created',
  FAILED = 'failed',
}

const ManagePaymentsPage: React.FC = () => {
  const [payments, setPayments] = useState<IPayment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState<IPayment | null>(null);


  const [paymentFormData, setPaymentFormData] = useState<{ status: string; razorpay_payment_id: string }>({ status: PaymentStatus.CREATED, razorpay_payment_id: '' });


  const [filterStatus, setFilterStatus] = useState<string>('');
  const [filterPlotId, setFilterPlotId] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);


  useEffect(() => {
    const fetchPayments = async () => {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (filterStatus) {
        params.append('search', filterStatus);
      }

      try {
        const response = await apiClient.get<IPayment[]>(`/admin/payments/?${params.toString()}`);
        setPayments(response || []);
      } catch (error) {
        console.error("Failed to fetch payments:", error);
        message.error("Could not fetch payment data.");
        setPayments([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPayments();
  }, [filterStatus]);


  const filteredPayments = useMemo(() => {
    return payments.filter(p => {
      return filterPlotId ? p.plot_id.toString().includes(filterPlotId) : true;
    });

  }, [payments, filterPlotId]);


  const totalPages = Math.ceil(filteredPayments.length / PAGE_SIZE);
  const pagedPayments = filteredPayments.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const openEditModal = (payment: IPayment) => {
    setEditingPayment(payment);
    setPaymentFormData({
      status: payment.status,
      razorpay_payment_id: payment.razorpay_payment_id || ''
    });
    setIsModalOpen(true);
  };

  const handleFormInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPaymentFormData(prev => ({ ...prev, [name]: value }));
  };


  const handleSaveChanges = async () => {
    if (!editingPayment) return;

    const payload = {
      status: paymentFormData.status,
      razorpay_payment_id: paymentFormData.razorpay_payment_id || null
    };

    try {
      await apiClient.patch(`/admin/payments/${editingPayment.id}/`, payload);
      message.success(`Payment ${editingPayment.id} updated successfully!`);


      const response = await apiClient.get<IPayment[]>(`/admin/payments/`);
      setPayments(response || []);

      setIsModalOpen(false);
      setEditingPayment(null);
    } catch (error) {
      console.error("Failed to update payment:", error);
      message.error("Failed to update payment.");
    }
  };


  const getStatusClass = (status: IPayment['status']): string => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'created': return 'bg-blue-100 text-blue-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-neutral-100 text-neutral-800';
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
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
              {Object.values(PaymentStatus).map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="filterPlotId" className="block text-sm font-medium text-neutral-700">Filter by Plot ID</label>
            <input
              type="text"
              id="filterPlotId"
              placeholder="Enter Plot ID"
              value={filterPlotId}
              onChange={(e) => setFilterPlotId(e.target.value)}
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
                {['Payment ID', 'Order ID', 'Plot ID', 'User ID', 'Amount (₹)', 'Created At', 'Status', 'Actions'].map(header => (
                  <th key={header} scope="col" className="px-6 py-3 text-left text-xs font-bold text-primary uppercase tracking-wider">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-neutral-100">
              {isLoading ? (
                <tr><td colSpan={8} className="text-center py-10">Loading payments...</td></tr>
              ) : pagedPayments.length > 0 ? (
                pagedPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-primary/5 transition">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-neutral-900">{payment.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500 font-mono text-xs">{payment.razorpay_order_id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">{payment.plot_id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">{payment.user}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">₹{payment.amount.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">{new Date(payment.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full shadow ${getStatusClass(payment.status)}`}>
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Button size="sm" variant="outline" onClick={() => openEditModal(payment)} leftIcon={<IconPencil className="w-4 h-4" />}>
                        Update
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={8} className="text-center py-10 text-neutral-400">No payments match filters.</td></tr>
              )}
            </tbody>
          </table>
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
        </div>
      </Card>
      {editingPayment && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="">
          <div className="max-w-md mx-auto bg-gradient-to-br from-blue-50 via-white to-blue-100 rounded-2xl shadow-2xl p-0">
            <div className="flex items-center justify-between px-8 pt-8 pb-2">
              <h2 className="text-xl font-bold text-primary flex items-center gap-2">
                <IconPencil className="w-5 h-5 text-primary" />
                Update Payment #{editingPayment.id}
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
                    <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
                  ))}
                </select>
              </div>
              {paymentFormData.status === PaymentStatus.PAID && (
                <div>
                  <label htmlFor="razorpay_payment_id" className="block text-sm font-medium text-neutral-700">Transaction ID</label>
                  <input
                    type="text"
                    name="razorpay_payment_id"
                    id="razorpay_payment_id"
                    value={paymentFormData.razorpay_payment_id}
                    onChange={handleFormInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  />
                </div>
              )}
              <div className="flex justify-end space-x-3 pt-2">
                <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button variant="primary" onClick={handleSaveChanges}>Save Changes</Button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ManagePaymentsPage;