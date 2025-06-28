import React, { useState } from 'react';
import { CurrencyDollarIcon, CalendarDaysIcon, StarIcon, MapPinIcon } from '@heroicons/react/24/outline';

// --- 1. TypeScript Interfaces ---
type BookingStatus = 'Confirmed' | 'Processing' | 'Cancelled';
type PaymentStatus = 'Completed' | 'Processing' | 'Failed';

interface Booking {
  id: string;
  title: string;
  location: string;
  bookingDate: string;
  status: BookingStatus;
  pricePaid: string;
  imageUrl: string;
}

interface Shortlist {
  id: string;
  title: string;
  location: string;
  price: string;
  sellerName: string;
  imageUrl: string;
}

// New Interface for Payments
interface Payment {
  id: string;
  date: string;
  description: string;
  amount: string;
  status: PaymentStatus;
}


// --- 2. Mock Data ---
const initialBookings: Booking[] = [
    { id: 'book001', title: '5000 sq.ft. Rose Plantation', location: 'Pune, Maharashtra', bookingDate: '2023-10-15', status: 'Confirmed', pricePaid: '₹12,00,000', imageUrl: 'https://images.unsplash.com/photo-1596299436445-53552077f5a3?q=80&w=1931&auto=format&fit=crop' },
    { id: 'book002', title: 'Organic Vegetable Farmland', location: 'Nashik, Maharashtra', bookingDate: '2023-09-02', status: 'Processing', pricePaid: '₹18,50,000', imageUrl: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?q=80&w=2070&auto=format&fit=crop' },
];

const initialShortlists: Shortlist[] = [
    { id: 'shortlist01', title: '1 Acre Teak Wood Farm', location: 'Wada, Maharashtra', price: '₹25,00,000', sellerName: 'Wada AgroFarms', imageUrl: 'https://s3.ap-south-1.amazonaws.com/www.cimg.in/images/2020/04/05/48/168560995_15860998961_large.jpg' },
    { id: 'shortlist02', title: '2 Acre Mixed Fruit Farm', location: 'Murbad, Maharashtra', price: '₹40,00,000', sellerName: 'Green Valley Estates', imageUrl: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=2070&auto=format&fit=crop' }
];

// New Mock Data for Payments
const initialPayments: Payment[] = [
    { id: 'pay_01', date: '2023-10-15', description: 'Down payment for "5000 sq.ft. Rose Plantation"', amount: '₹2,00,000', status: 'Completed' },
    { id: 'pay_02', date: '2023-09-02', description: 'Token advance for "Organic Vegetable Farmland"', amount: '₹50,000', status: 'Completed' },
    { id: 'pay_03', date: '2023-08-20', description: 'Platform Service Fee', amount: '₹1,500', status: 'Completed' },
    { id: 'pay_04', date: '2023-07-10', description: 'Final settlement for "Previous Property"', amount: '₹8,00,000', status: 'Completed' },
];


// --- 3. The Main UserDashboard Component ---

const UserDashboard: React.FC = () => {
  // --- State Management ---
  const [bookings] = useState<Booking[]>(initialBookings);
  const [shortlists, setShortlists] = useState<Shortlist[]>(initialShortlists);
  const [payments] = useState<Payment[]>(initialPayments); // New state for payments
  const [activeTab, setActiveTab] = useState<string>('bookings');


  // --- Helper Functions ---
  const handleRemoveShortlist = (idToRemove: string) => {
    setShortlists(currentShortlists => 
      currentShortlists.filter(item => item.id !== idToRemove)
    );
  };

  const getTabClass = (tabName: string) => {
    return activeTab === tabName
      ? 'bg-green-100 text-green-700 border-green-600'
      : 'text-gray-500 border-transparent hover:bg-gray-100 hover:border-gray-300';
  };

  const getStatusBadge = (status: BookingStatus | PaymentStatus) => {
    const styles: Record<string, string> = {
      Confirmed: 'bg-green-100 text-green-800',
      Processing: 'bg-blue-100 text-blue-800',
      Cancelled: 'bg-red-100 text-red-800',
      Completed: 'bg-green-100 text-green-800',
      Failed: 'bg-red-100 text-red-800',
    };
    return styles[status] || 'bg-gray-100 text-gray-800';
  };

  // --- JSX Rendering ---
  return (
    <div className="p-4 sm:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Dashboard</h1>
      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-2 sm:space-x-6" aria-label="Tabs">
             <button onClick={() => setActiveTab('bookings')} className={`flex items-center gap-2 px-3 py-2 font-semibold text-sm rounded-t-md border-b-2 ${getTabClass('bookings')}`}>
              <CalendarDaysIcon className="h-5 w-5"/> My Bookings
            </button>
            <button onClick={() => setActiveTab('shortlisted')} className={`flex items-center gap-2 px-3 py-2 font-semibold text-sm rounded-t-md border-b-2 ${getTabClass('shortlisted')}`}>
              <StarIcon className="h-5 w-5"/> Shortlisted Properties
            </button>
            {/* "My Listings" tab is now "My Payments" */}
            <button onClick={() => setActiveTab('payments')} className={`flex items-center gap-2 px-3 py-2 font-semibold text-sm rounded-t-md border-b-2 ${getTabClass('payments')}`}>
              <CurrencyDollarIcon className="h-5 w-5"/> My Payments
            </button>
          </nav>
        </div>
      </div>

      <div>
        {/* My Bookings Tab */}
        {activeTab === 'bookings' && (
          <div className="space-y-6">
            {bookings.map(booking => (
              <div key={booking.id} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden flex flex-col sm:flex-row">
                <img src={booking.imageUrl} alt={booking.title} className="h-48 w-full sm:w-56 object-cover"/>
                <div className="p-5 flex flex-col flex-grow">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-semibold text-gray-800">{booking.title}</h3>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${getStatusBadge(booking.status)}`}>{booking.status}</span>
                  </div>
                  <p className="flex items-center gap-1 text-sm text-gray-500 mt-1"><MapPinIcon className="h-4 w-4"/> {booking.location}</p>
                  <div className="mt-4 pt-4 border-t border-gray-100 flex-grow flex items-end justify-between">
                     <div>
                        <p className="text-sm text-gray-500">Booked On: {booking.bookingDate}</p>
                        <p className="text-lg text-green-700 font-bold">{booking.pricePaid}</p>
                     </div>
                     <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 font-semibold text-sm">View Details</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Shortlisted Properties Tab */}
        {activeTab === 'shortlisted' && (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {shortlists.map(item => (
               <div key={item.id} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden flex flex-col">
                  <img src={item.imageUrl} alt={item.title} className="h-48 w-full object-cover"/>
                  <div className="p-4 flex flex-col flex-grow">
                    <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{item.location}</p>
                    <p className="text-xl text-green-700 font-bold mt-2 flex-grow">{item.price}</p>
                    <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center gap-2">
                       <button className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 font-semibold text-sm">Contact Seller</button>
                       <button onClick={() => handleRemoveShortlist(item.id)} className="text-red-600 hover:text-red-800 font-semibold text-sm px-3 py-2 rounded-md hover:bg-red-50">Remove</button>
                    </div>
                  </div>
               </div>
             ))}
           </div>
        )}

        {/* My Payments Tab */}
        {activeTab === 'payments' && (
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Description</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Amount</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {payments.map(payment => (
                            <tr key={payment.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{payment.date}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 font-medium">{payment.description}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-lg font-semibold text-gray-700">{payment.amount}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">
                                  <span className={`px-2 inline-flex text-xs leading-5 rounded-full ${getStatusBadge(payment.status)}`}>
                                    {payment.status}
                                  </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}
      </div>
    </div>
  );
}

export default UserDashboard;