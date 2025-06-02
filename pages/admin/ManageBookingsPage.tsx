
import React, { useState } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import { MOCK_BOOKINGS, MOCK_USERS, MOCK_PLOTS, IconPencil } from '../../constants';
import { Booking, BookingStatus, PlotInfo, User } from '../../types';

const ManageBookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>(MOCK_BOOKINGS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [currentStatus, setCurrentStatus] = useState<BookingStatus>(BookingStatus.PENDING_CONFIRMATION);

  const getUserName = (userId: string): string => MOCK_USERS.find(u => u.id === userId)?.name || 'Unknown User';
  const getPlotNumber = (plotId: string): string => MOCK_PLOTS.find(p => p.id === plotId)?.plotNo || 'Unknown Plot';

  const openStatusModal = (booking: Booking) => {
    setSelectedBooking(booking);
    setCurrentStatus(booking.status);
    setIsModalOpen(true);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentStatus(e.target.value as BookingStatus);
  };

  const handleSaveStatus = () => {
    if (selectedBooking) {
      const updatedBookings = bookings.map(b => 
        b.id === selectedBooking.id ? { ...b, status: currentStatus } : b
      );
      setBookings(updatedBookings);
      
      // If booking is confirmed, mark plot as unavailable
      if (currentStatus === BookingStatus.CONFIRMED) {
          const plotIndex = MOCK_PLOTS.findIndex(p => p.id === selectedBooking.plotId);
          if (plotIndex > -1) {
              MOCK_PLOTS[plotIndex].isAvailable = false;
          }
      }
      // If booking is cancelled, mark plot as available
      else if (currentStatus === BookingStatus.CANCELLED) {
           const plotIndex = MOCK_PLOTS.findIndex(p => p.id === selectedBooking.plotId);
          if (plotIndex > -1) {
              MOCK_PLOTS[plotIndex].isAvailable = true;
          }
      }
      setIsModalOpen(false);
      setSelectedBooking(null);
    }
  };
  
  const getStatusClass = (status: BookingStatus): string => {
    switch (status) {
      case BookingStatus.CONFIRMED: return 'bg-green-100 text-green-800';
      case BookingStatus.PENDING_CONFIRMATION: return 'bg-yellow-100 text-yellow-800';
      case BookingStatus.CANCELLED: return 'bg-red-100 text-red-800';
      case BookingStatus.COMPLETED: return 'bg-blue-100 text-blue-800';
      default: return 'bg-neutral-100 text-neutral-800';
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-neutral-800 mb-6">Manage Bookings</h1>
      
      <Card bodyClassName="p-0">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-neutral-200">
            <thead className="bg-neutral-50">
              <tr>
                {['Booking ID', 'Plot No', 'User', 'Booking Date', 'Status', 'Actions'].map(header => (
                  <th key={header} scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-neutral-200">
              {bookings.map((booking) => (
                <tr key={booking.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-900">{booking.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">{getPlotNumber(booking.plotId)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">{getUserName(booking.userId)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">{new Date(booking.bookingDate).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                     <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(booking.status)}`}>
                        {booking.status}
                      </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Button size="sm" variant="outline" onClick={() => openStatusModal(booking)} leftIcon={<IconPencil className="w-4 h-4"/>}>
                      Update Status
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {bookings.length === 0 && <p className="text-center py-4 text-neutral-500">No bookings found.</p>}
        </div>
      </Card>

      {selectedBooking && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`Update Status for Booking ${selectedBooking.id}`}>
          <div className="space-y-4">
            <div>
              <label htmlFor="bookingStatus" className="block text-sm font-medium text-neutral-700">Booking Status</label>
              <select 
                id="bookingStatus" 
                name="bookingStatus"
                value={currentStatus} 
                onChange={handleStatusChange}
                className="mt-1 block w-full px-3 py-2 border border-neutral-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              >
                {Object.values(BookingStatus).map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
            <div className="flex justify-end space-x-3 pt-2">
              <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button variant="primary" onClick={handleSaveStatus}>Save Status</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ManageBookingsPage;
