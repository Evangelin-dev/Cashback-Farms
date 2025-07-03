import React, { useState, useEffect } from 'react';
// NEW: Import useNavigate for programmatic routing
import { useNavigate } from 'react-router-dom';
import { CurrencyDollarIcon, CalendarDaysIcon, StarIcon, MapPinIcon, TrashIcon } from '@heroicons/react/24/outline';
import apiClient from '@/src/utils/api/apiClient';

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

// This interface matches your /cart/ API response
interface Shortlist {
  id: number;
  item_type: 'plotlisting' | 'microplot' | 'material' | string; // Made specific types for clarity
  item_id: number;
  item_title: string;
  quantity: number;
  price_per_unit: number;
  total_item_value: string;
}

interface Payment {
  id: string;
  date: string;
  description: string;
  amount: string;
  status: PaymentStatus;
}

// --- 2. Mock Data (keeping for other tabs) ---
const initialBookings: Booking[] = [
  { id: 'book001', title: '5000 sq.ft. Rose Plantation', location: 'Pune, Maharashtra', bookingDate: '2023-10-15', status: 'Confirmed', pricePaid: '₹12,00,000', imageUrl: 'https://images.unsplash.com/photo-1596299436445-53552077f5a3?q=80&w=1931&auto=format&fit=crop' },
  { id: 'book002', title: 'Organic Vegetable Farmland', location: 'Nashik, Maharashtra', bookingDate: '2023-09-02', status: 'Processing', pricePaid: '₹18,50,000', imageUrl: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?q=80&w=2070&auto=format&fit=crop' },
];

const initialPayments: Payment[] = [
  { id: 'pay_01', date: '2023-10-15', description: 'Down payment for "5000 sq.ft. Rose Plantation"', amount: '₹2,00,000', status: 'Completed' },
  { id: 'pay_02', date: '2023-09-02', description: 'Token advance for "Organic Vegetable Farmland"', amount: '₹50,000', status: 'Completed' },
];

// --- 3. The Main UserDashboard Component ---

const UserDashboard: React.FC = () => {
  // --- State Management ---
  const [bookings] = useState<Booking[]>(initialBookings);
  const [shortlists, setShortlists] = useState<Shortlist[]>([]);
  const [payments] = useState<Payment[]>(initialPayments);
  const [activeTab, setActiveTab] = useState<string>('bookings');
  const [isLoadingShortlist, setIsLoadingShortlist] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (activeTab === 'shortlisted') {
      const fetchShortlistedItems = async () => {
        setIsLoadingShortlist(true);
        setError(null);
        const accessToken = localStorage.getItem("access_token");

        if (!accessToken) {
          setError("You are not logged in.");
          setIsLoadingShortlist(false);
          return;
        }

        try {
          const response = await apiClient.get<Shortlist[]>('/cart/', {
            headers: { Authorization: `Bearer ${accessToken}` }
          });
          setShortlists(response || []);
          console.log(response, 'response');
        } catch (err) {
          console.error("Failed to fetch shortlists:", err);
          setError("Could not load shortlisted items. Please try again later.");
        } finally {
          setIsLoadingShortlist(false);
        }
      };

      fetchShortlistedItems();
    }
  }, [activeTab]);

  const handleRemoveShortlist = async (idToRemove: number) => {
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) {
      alert("Please log in to modify your cart.");
      return;
    }

    // Optimistic UI: remove from state first for instant feedback
    const originalShortlists = [...shortlists];
    setShortlists(current => current.filter(item => item.id !== idToRemove));

    try {
      await apiClient.delete(`/cart/remove-item/${idToRemove}/`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
    } catch (err) {
      console.error("Failed to remove item:", err);
      alert("Could not remove the item. Please try again.");
      // Rollback on error
      setShortlists(originalShortlists);
    }
  };

  // NEW: handleClearCart makes an API call to clear everything
  const handleClearCart = async () => {
    if (!window.confirm("Are you sure you want to remove all items from your shortlist?")) {
      return;
    }
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) {
      alert("Please log in to modify your cart.");
      return;
    }
    try {
      await apiClient.post('/cart/clear/', {}, { // POST request as requested
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      setShortlists([]); // Clear UI on success
    } catch (err) {
      console.error("Failed to clear cart:", err);
      alert("Could not clear the shortlist. Please try again.");
    }
  };

  // NEW: handleViewDetails navigates based on item type
  const handleViewDetails = (item: Shortlist) => {
    let path = '';
    switch (item.item_type) {
      case 'plotlisting':
        path = `/book-my-sqft/${item.item_id}`;
        break;
      case 'microplot':
        path = `/mysqft-listing/${item.item_id}`;
        break;
      case 'material':
        path = `/materials/${item.item_id}`;
        break;
      default:
        console.warn('Unknown item type for redirection:', item.item_type);
        // Optional: redirect to a generic page or do nothing
        return;
    }
    navigate(path);
  };

  const formatCurrency = (value: string | number) => {
    const numberValue = typeof value === 'string' ? parseFloat(value) : value;
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(numberValue);
  };

  const getTabClass = (tabName: string) => activeTab === tabName ? 'bg-green-100 text-green-700 border-green-600' : 'text-gray-500 border-transparent hover:bg-gray-100 hover:border-gray-300';
  const getStatusBadge = (status: BookingStatus | PaymentStatus) => { /* ... (unchanged) ... */ return 'bg-gray-100 text-gray-800'; };

  // --- JSX Rendering ---
  return (
    <div className="p-4 sm:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Dashboard</h1>
      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-2 sm:space-x-6" aria-label="Tabs">
            <button onClick={() => setActiveTab('bookings')} className={`flex items-center gap-2 px-3 py-2 font-semibold text-sm rounded-t-md border-b-2 ${getTabClass('bookings')}`}>
              <CalendarDaysIcon className="h-5 w-5" /> My Bookings
            </button>
            <button onClick={() => setActiveTab('shortlisted')} className={`flex items-center gap-2 px-3 py-2 font-semibold text-sm rounded-t-md border-b-2 ${getTabClass('shortlisted')}`}>
              <StarIcon className="h-5 w-5" /> Shortlisted Properties
            </button>
            <button onClick={() => setActiveTab('payments')} className={`flex items-center gap-2 px-3 py-2 font-semibold text-sm rounded-t-md border-b-2 ${getTabClass('payments')}`}>
              <CurrencyDollarIcon className="h-5 w-5" /> My Payments
            </button>
          </nav>
        </div>
      </div>

      <div>
        {/* My Bookings Tab (Unchanged) */}
        {activeTab === 'bookings' && (
          <div className="space-y-6">
            {bookings.map(booking => (
              <div key={booking.id} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden flex flex-col sm:flex-row">
                <img src={booking.imageUrl} alt={booking.title} className="h-48 w-full sm:w-56 object-cover" />
                <div className="p-5 flex flex-col flex-grow">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-semibold text-gray-800">{booking.title}</h3>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${getStatusBadge(booking.status)}`}>{booking.status}</span>
                  </div>
                  <p className="flex items-center gap-1 text-sm text-gray-500 mt-1"><MapPinIcon className="h-4 w-4" /> {booking.location}</p>
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
          <div>
            {/* NEW: Header with Clear All button */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Shortlisted Items</h2>
              {shortlists.length > 0 && !isLoadingShortlist && (
                <button
                  onClick={handleClearCart}
                  className="flex items-center gap-2 text-sm font-semibold text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 px-3 py-2 rounded-md transition-colors"
                >
                  <TrashIcon className="h-4 w-4" />
                  Clear All
                </button>
              )}
            </div>

            {isLoadingShortlist ? (
              <div className="text-center p-10"><p className="text-gray-500">Loading your shortlisted properties...</p></div>
            ) : error ? (
              <div className="text-center p-10 bg-red-50 text-red-700 rounded-lg"><p>{error}</p></div>
            ) : shortlists.length === 0 ? (
              <div className="text-center p-10 bg-gray-100 rounded-lg">
                <p className="font-semibold text-gray-700">Your Shortlist is Empty</p>
                <p className="text-sm text-gray-500 mt-2">Start exploring and add properties to your shortlist!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {shortlists.map(item => (
                  <div key={item.id} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden flex flex-col transition hover:shadow-lg hover:-translate-y-1">
                    <img src={`https://source.unsplash.com/random/400x300/?farm,land,${item.item_id}`} alt={item.item_title} className="h-48 w-full object-cover" />
                    <div className="p-4 flex flex-col flex-grow">
                      <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full self-start">{item.item_type}</span>
                      <h3 className="text-lg font-semibold text-gray-800 mt-2">{item.item_title}</h3>
                      <p className="text-xl text-green-700 font-bold mt-2 flex-grow">{formatCurrency(item.total_item_value)}</p>
                      <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center gap-2">
                        {/* UPDATED: OnClick now calls the new handler */}
                        <button onClick={() => handleViewDetails(item)} className="flex-1 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 font-semibold text-sm">View Details</button>
                        {/* UPDATED: OnClick now calls the new handler */}
                        <button onClick={() => handleRemoveShortlist(item.id)} className="text-red-600 hover:text-red-800 font-semibold text-sm px-3 py-2 rounded-md hover:bg-red-50">Remove</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* My Payments Tab (Unchanged) */}
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