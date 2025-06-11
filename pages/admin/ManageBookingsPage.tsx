import React, { useState } from 'react';
import Button from '../../components/Button';
import Card from '../../components/Card';
import Modal from '../../components/Modal';
import { IconPencil, MOCK_BOOKINGS, MOCK_PLOTS, MOCK_USERS } from '../../constants';
import { Booking, BookingStatus } from '../../types';

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
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary shadow">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2a4 4 0 014-4h4a4 4 0 014 4v2M9 7a4 4 0 11-8 0 4 4 0 018 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 21v-2a4 4 0 00-3-3.87M9 21v-2a4 4 0 013-3.87" />
            </svg>
          </span>
          <div>
            <h1 className="text-2xl font-bold text-primary mb-1">Manage Bookings</h1>
            <div className="text-sm text-neutral-500">View, update, and manage all plot bookings.</div>
          </div>
        </div>
      </div>
      <Card bodyClassName="p-0">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-neutral-200">
            <thead className="bg-gradient-to-r from-primary/10 via-white to-primary/10">
              <tr>
                {['Booking ID', 'Plot No', 'User', 'Booking Date', 'Status', 'Actions'].map(header => (
                  <th key={header} scope="col" className="px-6 py-3 text-left text-xs font-bold text-primary uppercase tracking-wider">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-neutral-100">
              {bookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-primary/5 transition">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-neutral-900">{booking.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">{getPlotNumber(booking.plotId)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">{getUserName(booking.userId)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">{new Date(booking.bookingDate).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                     <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full shadow ${getStatusClass(booking.status)}`}>
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
          {bookings.length === 0 && (
            <div className="text-center py-10 text-neutral-400 text-lg">
              <svg className="w-16 h-16 mx-auto mb-2 text-primary/20" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2a4 4 0 014-4h4a4 4 0 014 4v2M9 7a4 4 0 11-8 0 4 4 0 018 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 21v-2a4 4 0 00-3-3.87M9 21v-2a4 4 0 013-3.87" />
              </svg>
              No bookings found.
            </div>
          )}
        </div>
      </Card>
      {selectedBooking && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="">
          <div className="max-w-md mx-auto bg-gradient-to-br from-blue-50 via-white to-blue-100 rounded-2xl shadow-2xl p-0">
            <div className="flex items-center justify-between px-8 pt-8 pb-2">
              <h2 className="text-xl font-bold text-primary flex items-center gap-2">
                <IconPencil className="w-5 h-5 text-primary" />
                Update Status for Booking {selectedBooking.id}
              </h2>
            </div>
            <div className="space-y-4 px-8 pb-8 pt-2">
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

export default ManageBookingsPage;
