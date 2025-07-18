import React, { useEffect, useState, useCallback } from 'react';
import { Card, Table, Tag, Modal, Select, message } from 'antd';
import Button from '../../components/Button';
import apiClient from '../../src/utils/api/apiClient';
import { IconPencil } from '../../constants';

type BookingStatus = "pending" | "confirmed" | "cancelled" | "completed";
const ALL_STATUSES: BookingStatus[] = ["pending", "confirmed", "cancelled", "completed"];

interface Booking {
  id: number;
  key: number;
  plot_listing: number;
  plot_title: string;
  client: number;
  client_username: string;
  booking_date: string;
  status: BookingStatus;
}

const ManageBookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [currentStatus, setCurrentStatus] = useState<BookingStatus>('Pending');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);


  const fetchBookings = useCallback(async () => {
    setIsLoading(true);
    try {
      const accessToken = localStorage.getItem("access_token");
      const response = await apiClient.get('/admin/bookings/', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      
      const mappedBookings = (response || []).map((booking: any) => ({
        ...booking,
        key: booking.id,
      }));

      setBookings(mappedBookings.sort((a: Booking, b: Booking) => b.id - a.id));
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
      message.error("Could not load booking data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const openStatusModal = (booking: Booking) => {
    setSelectedBooking(booking);
    setCurrentStatus(booking.status);
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedBooking(null);
  };


  const handleSaveStatus = async () => {
    if (!selectedBooking) return;
    
    setIsSubmitting(true);
    try {
      const accessToken = localStorage.getItem("access_token");
    
      const payload = { status: currentStatus.toLowerCase() };
      
      await apiClient.patch(`/admin/bookings/${selectedBooking.id}/update-status/`, payload, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      
      message.success(`Booking #${selectedBooking.id} status updated to ${currentStatus}.`);
      fetchBookings();
      closeModal();

    } catch (error) {
      console.error("Failed to update status:", error);
      message.error("Failed to update booking status.");
    } finally {
      setIsSubmitting(false);
    }
  };
  

  const getStatusClass = (status: BookingStatus): string => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-neutral-100 text-neutral-800';
    }
  };

  const columns = [
    { title: 'Booking ID', dataIndex: 'id', key: 'id', render: (id: number) => <span className="font-semibold text-neutral-900">#{id}</span> },
    { title: 'Plot Title', dataIndex: 'plot_title', key: 'plot_title', render: (text: string) => <span className="text-sm text-neutral-600">{text}</span> },
    { title: 'Client', dataIndex: 'client_username', key: 'client_username', render: (text: string) => <span className="text-sm text-neutral-600">{text}</span> },
    { title: 'Booking Date', dataIndex: 'booking_date', key: 'booking_date', render: (date: string) => <span className="text-sm text-neutral-500">{new Date(date).toLocaleDateString()}</span> },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (status: BookingStatus) => <Tag className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full shadow-sm ${getStatusClass(status)}`}>{status}</Tag> },
    { title: 'Actions', key: 'actions', render: (_: any, record: Booking) => <Button size="sm" variant="outline" onClick={() => openStatusModal(record)} leftIcon={<IconPencil className="w-4 h-4"/>}>Update Status</Button> },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary shadow">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2a4 4 0 014-4h4a4 4 0 014 4v2M9 7a4 4 0 11-8 0 4 4 0 018 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M17 21v-2a4 4 0 00-3-3.87M9 21v-2a4 4 0 013-3.87" /></svg>
          </span>
          <div>
            <h1 className="text-2xl font-bold text-primary mb-1">Manage Bookings</h1>
            <div className="text-sm text-neutral-500">View, update, and manage all plot bookings.</div>
          </div>
        </div>
      </div>
      <Card bodyClassName="p-0">
        <div className="overflow-x-auto">
          <Table
            dataSource={bookings}
            columns={columns}
            loading={isLoading}
            rowKey="key"
            pagination={{ pageSize: 10, hideOnSinglePage: true }}
            className="min-w-full divide-y divide-neutral-200"
          />
        </div>
      </Card>
      
      {selectedBooking && (
        <Modal
          title={
            <div className="flex items-center gap-2">
              <IconPencil className="w-5 h-5 text-primary" />
              <span className="text-xl font-bold text-primary">Update Status for Booking #{selectedBooking.id}</span>
            </div>
          }
          open={isModalOpen}
          onCancel={closeModal}
          footer={null}
          centered
        >
          <div className="space-y-4 px-2 py-6">
            <div>
              <label htmlFor="bookingStatus" className="block text-sm font-medium text-neutral-700 mb-2">
                Booking Status
              </label>
              <Select 
                id="bookingStatus" 
                value={currentStatus} 
                onChange={(value) => setCurrentStatus(value)}
                style={{ width: '100%' }}
                size="large"
              >
                {ALL_STATUSES.map(status => (
                  <Select.Option key={status} value={status}>{status}</Select.Option>
                ))}
              </Select>
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <Button variant="secondary" onClick={closeModal} disabled={isSubmitting}>Cancel</Button>
              <Button variant="primary" onClick={handleSaveStatus} loading={isSubmitting}>Save Status</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ManageBookingsPage;