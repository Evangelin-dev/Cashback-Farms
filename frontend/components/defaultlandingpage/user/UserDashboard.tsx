import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { CurrencyDollarIcon, CalendarDaysIcon, StarIcon, MapPinIcon, TrashIcon } from '@heroicons/react/24/outline';
import apiClient from '@/src/utils/api/apiClient';

// --- TYPE DEFINITIONS ---

type Status = 'Confirmed' | 'Pending' | 'Cancelled' | 'Completed' | 'Processing' | 'Failed';

// Matches the /my/bookings/ API response
interface ApiBooking {
  id: number;
  plot_listing: number;
  plot_title: string;
  client: number;
  client_username: string;
  booking_type: string;
  booked_area_sqft: string;
  total_price: string;
  booking_date: string;
  status: Status;
}

// Matches the /my-payments/ API response
interface ApiPayment {
  transaction_id: string;
  description: string;
  amount: string;
  date: string;
  status: Status;
}

// Matches the /cart/ API response
interface Shortlist {
  id: number;
  item_type: 'plotlisting' | 'sqlftproject' | 'ecommerceproduct' | string;
  item_id: number;
  item_title: string;
  total_item_value: string;
}

const UserDashboard: React.FC = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<string>('bookings');

  const [bookings, setBookings] = useState<ApiBooking[]>([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(true);
  const [bookingError, setBookingError] = useState<string | null>(null);

  const [shortlists, setShortlists] = useState<Shortlist[]>([]);
  const [isLoadingShortlist, setIsLoadingShortlist] = useState(true);
  const [shortlistError, setShortlistError] = useState<string | null>(null);

  const [payments, setPayments] = useState<ApiPayment[]>([]);
  const [isLoadingPayments, setIsLoadingPayments] = useState(true);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const [shortlistFilter, setShortlistFilter] = useState('all');

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) {
      const errorMsg = "You are not logged in.";
      setBookingError(errorMsg);
      setShortlistError(errorMsg);
      setPaymentError(errorMsg);
      return;
    }
    const headers = { Authorization: `Bearer ${accessToken}` };

    if (activeTab === 'bookings') {
      setIsLoadingBookings(true);
      apiClient.get<ApiBooking[]>('/my/bookings/', { headers })
        .then(response => {
          const sortedData = (response || []).sort((a, b) => new Date(b.booking_date).getTime() - new Date(a.booking_date).getTime());
          setBookings(sortedData);
        })
        .catch(() => setBookingError("Could not load your bookings."))
        .finally(() => setIsLoadingBookings(false));
    } else if (activeTab === 'shortlisted') {
      setIsLoadingShortlist(true);
      apiClient.get<Shortlist[]>('/cart/', { headers })
        .then(response => setShortlists(response || []))
        .catch(() => setShortlistError("Could not load your shortlisted items."))
        .finally(() => setIsLoadingShortlist(false));
    } else if (activeTab === 'payments') {
      setIsLoadingPayments(true);
      apiClient.get<ApiPayment[]>('/my-payments/', { headers })
        .then(response => {
          const sortedData = (response || []).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
          setPayments(sortedData);
        })
        .catch(() => setPaymentError("Could not load your payment history."))
        .finally(() => setIsLoadingPayments(false));
    }
  }, [activeTab]);

  const filteredShortlists = useMemo(() => {
    if (shortlistFilter === 'all') return shortlists;
    return shortlists.filter(item => item.item_type === shortlistFilter);
  }, [shortlists, shortlistFilter]);

  const handleRemoveShortlist = async (idToRemove: number) => {
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) {
      alert("Please log in to modify your cart.");
      return;
    }
    const originalShortlists = [...shortlists];
    setShortlists(current => current.filter(item => item.id !== idToRemove));
    try {
      await apiClient.delete(`/cart/remove-item/${idToRemove}/`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
    } catch (err) {
      alert("Could not remove the item. Please try again.");
      setShortlists(originalShortlists);
    }
  };
  
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
      await apiClient.post('/cart/clear/', {}, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      setShortlists([]);
    } catch (err) {
      alert("Could not clear the shortlist. Please try again.");
    }
  };

  const handleViewDetails = (item: Shortlist) => {
    let path = '';
    switch (item.item_type) {
      case 'plotlisting':
        path = `/book-my-sqft/${item.item_id}`;
        break;
      case 'sqlftproject':
        path = `/mysqft-listing/${item.item_id}`;
        break;
      case 'ecommerceproduct':
        path = `/materials/${item.item_id}`;
        break;
      default:
        console.warn('Unknown item type for redirection:', item.item_type);
        return;
    }
    navigate(path);
  };
  
  const formatCurrency = (value: string | number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(Number(value));
  const getTabClass = (tabName: string) => activeTab === tabName ? 'bg-green-100 text-green-700 border-green-600' : 'text-gray-500 border-transparent hover:bg-gray-100 hover:border-gray-300';

  const getStatusBadgeClass = (status: Status) => {
    const styles: { [key in Status]?: string } = {
      Confirmed: 'bg-green-100 text-green-800',
      Completed: 'bg-green-100 text-green-800',
      Pending: 'bg-yellow-100 text-yellow-800',
      Processing: 'bg-blue-100 text-blue-800',
      Cancelled: 'bg-red-100 text-red-800',
      Failed: 'bg-red-100 text-red-800',
    };
    return styles[status] || 'bg-gray-100 text-gray-800';
  };

  const FilterButton = ({ value, label }: { value: string; label: string }) => (
    <button onClick={() => setShortlistFilter(value)} className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 capitalize ${shortlistFilter === value ? 'bg-green-600 text-white shadow' : 'bg-gray-200 text-gray-700 hover:bg-green-100'}`}>{label}</button>
  );

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
        {activeTab === 'bookings' && (
          <div className="space-y-6">
            {isLoadingBookings && <div className="text-center p-10">Loading your bookings...</div>}
            {bookingError && <div className="text-center p-10 bg-red-50 text-red-700 rounded-lg">{bookingError}</div>}
            {!isLoadingBookings && !bookingError && bookings.length === 0 && <div className="text-center p-10 bg-gray-100 rounded-lg">You have no bookings yet.</div>}
            {!isLoadingBookings && !bookingError && bookings.map(booking => (
              <div key={booking.id} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden flex flex-col sm:flex-row">
                <img src={`https://source.unsplash.com/random/400x300/?land,plot,${booking.id}`} alt={booking.plot_title} className="h-48 w-full sm:w-56 object-cover" />
                <div className="p-5 flex flex-col flex-grow">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-semibold text-gray-800">{booking.plot_title}</h3>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${getStatusBadgeClass(booking.status)}`}>{booking.status}</span>
                  </div>
                  <p className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                    <span className="font-semibold">{booking.booking_type} Booking</span>
                  </p>
                  <div className="mt-4 pt-4 border-t border-gray-100 flex-grow flex items-end justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Booked On: {new Date(booking.booking_date).toLocaleDateString()}</p>
                      <p className="text-lg text-green-700 font-bold">{formatCurrency(booking.total_price)}</p>
                    </div>
                    <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 font-semibold text-sm">View Details</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'shortlisted' && (
          <div>
            <div className="flex justify-between items-center mb-6"><h2 className="text-2xl font-bold text-gray-800">Shortlisted Items</h2>{shortlists.length > 0 && <button onClick={handleClearCart} className="flex items-center gap-2 text-sm font-semibold text-red-600 hover:text-red-800"><TrashIcon className="h-4 w-4" /> Clear All</button>}</div>
            <div className="flex flex-wrap gap-3 mb-6 p-4 bg-white rounded-lg shadow-sm">
              <FilterButton value="all" label="All" />
              <FilterButton value="plotlisting" label="Plots" />
              <FilterButton value="sqlftproject" label="Micro-Plots" />
              <FilterButton value="ecommerceproduct" label="Materials" />
            </div>
            {isLoadingShortlist && <div className="text-center p-10">Loading your shortlist...</div>}
            {shortlistError && <div className="text-center p-10 bg-red-50 text-red-700 rounded-lg">{shortlistError}</div>}
            {!isLoadingShortlist && !shortlistError && filteredShortlists.length === 0 && <div className="text-center p-10 bg-gray-100 rounded-lg">Your shortlist is empty or no items match the filter.</div>}
            {!isLoadingShortlist && !shortlistError && <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{[...filteredShortlists].reverse().map(item => (
              <div key={item.id} className="bg-white border rounded-lg shadow-sm overflow-hidden flex flex-col">
                <img src={`https://source.unsplash.com/random/400x300/?farm,${item.item_type},${item.item_id}`} alt={item.item_title} className="h-48 w-full object-cover" />
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="text-lg font-semibold text-gray-800">{item.item_title}</h3>
                  <p className="text-xl text-green-700 font-bold mt-2 flex-grow">{formatCurrency(item.total_item_value)}</p>
                  <div className="mt-4 pt-4 border-t flex justify-between items-center gap-2">
                    <button onClick={() => handleViewDetails(item)} className="flex-1 bg-green-600 text-white px-4 py-2 rounded-md">View Details</button>
                    <button onClick={() => handleRemoveShortlist(item.id)} className="text-red-600 hover:text-red-800 font-semibold p-2 rounded-md hover:bg-red-50"><TrashIcon className="h-5 w-5" /></button>
                  </div>
                </div>
              </div>
            ))}</div>}
          </div>
        )}

        {activeTab === 'payments' && (
          <div className="bg-white border rounded-lg shadow-sm overflow-x-auto">
            {isLoadingPayments && <div className="text-center p-10">Loading payment history...</div>}
            {paymentError && <div className="text-center p-10 bg-red-50 text-red-700 rounded-lg">{paymentError}</div>}
            {!isLoadingPayments && !paymentError && payments.length === 0 && <div className="text-center p-10 bg-gray-100">You have no payment history.</div>}
            {!isLoadingPayments && !paymentError && (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50"><tr><th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Date</th><th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Transaction ID</th><th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Description</th><th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Amount</th><th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Status</th></tr></thead>
                <tbody className="bg-white divide-y divide-gray-200">{payments.map(payment => (
                  <tr key={payment.transaction_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{new Date(payment.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">{payment.transaction_id}</td>
                    <td className="px-6 py-4 text-sm text-gray-800 font-medium">{payment.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-lg font-semibold text-gray-700">{formatCurrency(payment.amount)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold"><span className={`px-2 inline-flex text-xs leading-5 rounded-full ${getStatusBadgeClass(payment.status)}`}>{payment.status}</span></td>
                  </tr>
                ))}</tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default UserDashboard;