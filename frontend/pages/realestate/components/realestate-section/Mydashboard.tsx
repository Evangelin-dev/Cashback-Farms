import React, { useState, useEffect } from 'react';
import { BriefcaseIcon, StarIcon, CurrencyDollarIcon, MapPinIcon, UsersIcon, PhoneIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import apiClient from '@/src/utils/api/apiClient'; // Make sure this path is correct

// --- 1. Updated TypeScript Interfaces to match API data ---
type PropertyStatus = 'Listed' | 'Sold' | 'Pending Approval';

interface Property {
  id: string;
  title: string;
  location: string;
  status: PropertyStatus;
  pricePerSqft: string;
  totalArea: string;
  availableArea: string;
  imageUrl: string;
}

interface Shortlist {
  id: string;
  title: string;
  location: string;
  sellerName: string;
}

interface Payment {
  id: string;
  date: string;
  description: string;
  amount: string;
  status: 'Completed' | 'Processing' | 'Failed';
}

interface Lead {
  leadId: string;
  buyerName: string;
  propertyTitle: string;
  contactedOn: string;
  buyerPhone: string;
  buyerEmail: string;
}

// --- 2. A Simple Loader Component ---
const Loader = () => (
  <div className="flex justify-center items-center p-10">
    <div className="w-8 h-8 border-4 border-dashed rounded-full animate-spin border-green-600"></div>
  </div>
);


// --- 3. The Main Dashboard Component ---
const MyDashboard: React.FC = () => {
  // --- State Management ---
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('listings');

  // --- Mock Data for other tabs ---
  const myShortlists: Shortlist[] = [
    { id: 'seller_plot_A', title: 'Organic Vegetable Farmland', location: 'Nashik, Maharashtra', sellerName: 'Rohan Patil' },
    { id: 'seller_plot_B', title: 'Rose Plantation Micro Plot', location: 'Pune, Maharashtra', sellerName: 'Sunita Agro' }
  ];
  const myPayments: Payment[] = [
    { id: 'txn_12345', date: '2023-09-20', description: 'Listing Fee', amount: '₹5,000', status: 'Completed' },
    { id: 'txn_12346', date: '2023-08-15', description: 'Premium Membership', amount: '₹15,000', status: 'Completed' }
  ];
  const interestedInquiries: Lead[] = [
    { leadId: 'lead01', buyerName: 'Anjali Sharma', propertyTitle: '1 Acre Teak Wood Farm', contactedOn: '2023-10-28', buyerPhone: '+91 98765 43210', buyerEmail: 'anjali.s@example.com' },
    { leadId: 'lead02', buyerName: 'Vikram Singh', propertyTitle: '1 Acre Teak Wood Farm', contactedOn: '2023-10-27', buyerPhone: '+91 91234 56789', buyerEmail: 'vikram.singh@example.com' }
  ];

  // --- Data Fetching Effect ---
  useEffect(() => {
    const fetchListings = async () => {
      setIsLoading(true);
      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) {
        console.error("No access token found.");
        setIsLoading(false);
        setProperties([]);
        return;
      }

      try {
        const res = await apiClient.get("/plots", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        const mappedProperties: Property[] = (res || []).map((plot: any) => {
          let status: PropertyStatus;
          if (plot.is_available_full) {
            status = 'Sold';
          } else if (plot.is_verified) {
            status = 'Listed';
          } else {
            status = 'Pending Approval';
          }

          return {
            id: plot.id.toString(),
            title: plot.title,
            location: plot.location,
            status: status,
            pricePerSqft: `₹${Number(plot.price_per_sqft).toLocaleString("en-IN")} / sq.ft`,
            totalArea: `${Number(plot.total_area_sqft).toLocaleString("en-IN")} sq.ft`,
            availableArea: `${Number(plot.available_sqft_for_investment).toLocaleString("en-IN")} sq.ft`,
            imageUrl: plot.plot_file || 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=1974&auto=format&fit=crop', // A nice fallback image
          };
        });

        setProperties(mappedProperties.reverse());
      } catch (err) {
        console.error("Failed to fetch listings for dashboard:", err);
        setProperties([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchListings();
  }, []);

  // --- Helper Functions ---
  const getTabClass = (tabName: string) => {
    return activeTab === tabName
      ? 'bg-green-100 text-green-700 border-green-600'
      : 'text-gray-500 border-transparent hover:bg-gray-100 hover:border-gray-300';
  };

  const getStatusBadge = (status: PropertyStatus) => {
    const styles: Record<PropertyStatus, string> = {
        Listed: 'bg-green-100 text-green-800',
        Sold: 'bg-gray-200 text-gray-800',
        'Pending Approval': 'bg-yellow-100 text-yellow-800',
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
            <button onClick={() => setActiveTab('listings')} className={`flex items-center gap-2 px-3 py-2 font-semibold text-sm rounded-t-md border-b-2 ${getTabClass('listings')}`}><BriefcaseIcon className="h-5 w-5"/> My Listings</button>
            <button onClick={() => setActiveTab('inquiries')} className={`flex items-center gap-2 px-3 py-2 font-semibold text-sm rounded-t-md border-b-2 ${getTabClass('inquiries')}`}><UsersIcon className="h-5 w-5"/> Interested Inquiries</button>
            <button onClick={() => setActiveTab('shortlisted')} className={`flex items-center gap-2 px-3 py-2 font-semibold text-sm rounded-t-md border-b-2 ${getTabClass('shortlisted')}`}><StarIcon className="h-5 w-5"/> My Shortlisted</button>
            <button onClick={() => setActiveTab('payments')} className={`flex items-center gap-2 px-3 py-2 font-semibold text-sm rounded-t-md border-b-2 ${getTabClass('payments')}`}><CurrencyDollarIcon className="h-5 w-5" /> My Payments</button>
          </nav>
        </div>
      </div>

      <div>
        {activeTab === 'listings' && (
          <div>
            {isLoading ? (
              <Loader />
            ) : properties.length > 0 ? (
              <div className="space-y-6">
                {properties.map(prop => (
                  <div key={prop.id} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden flex flex-col sm:flex-row">
                    <img src={prop.imageUrl} alt={prop.title} className="h-48 w-full sm:h-auto sm:w-56 object-cover"/>
                    <div className="p-5 flex flex-col flex-grow">
                      <div className="flex justify-between items-start">
                        <h3 className="text-xl font-semibold text-gray-800">{prop.title}</h3>
                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${getStatusBadge(prop.status)}`}>{prop.status}</span>
                      </div>
                      <p className="flex items-center gap-1 text-sm text-gray-500 mt-1 mb-4"><MapPinIcon className="h-4 w-4"/> {prop.location}</p>

                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2 border-t border-gray-100 pt-4">
                        <div>
                          <p className="text-xs text-gray-500">Price</p>
                          <p className="font-semibold text-gray-800">{prop.pricePerSqft}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Total Area</p>
                          <p className="font-semibold text-gray-800">{prop.totalArea}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Available for Investment</p>
                          <p className="font-semibold text-green-600">{prop.availableArea}</p>
                        </div>
                      </div>

                      <div className="mt-auto pt-4 flex justify-end">
                        <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 font-semibold text-xs">Manage</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-10">You have not listed any properties yet.</p>
            )}
          </div>
        )}

        {activeTab === 'inquiries' && (
           <div className="space-y-5">
             {interestedInquiries.map(lead => (
               <div key={lead.leadId} className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-semibold text-indigo-700">{lead.buyerName}</h3>
                      <p className="text-sm text-gray-600 mt-1">Is interested in: <span className="font-medium">{lead.propertyTitle}</span></p>
                    </div>
                    <p className="text-xs text-gray-500">Inquired on: {lead.contactedOn}</p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-start gap-4">
                     <a href={`tel:${lead.buyerPhone}`} className="inline-flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-green-600"><PhoneIcon className="h-4 w-4"/> {lead.buyerPhone}</a>
                     <a href={`mailto:${lead.buyerEmail}`} className="inline-flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-green-600"><EnvelopeIcon className="h-4 w-4"/> {lead.buyerEmail}</a>
                  </div>
               </div>
             ))}
           </div>
        )}

        {activeTab === 'shortlisted' && (
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                <ul className="divide-y divide-gray-200">
                    {myShortlists.map(item => (
                        <li key={item.id} className="p-4 flex justify-between items-center hover:bg-gray-50">
                            <div>
                                <p className="font-semibold text-gray-800">{item.title}</p>
                                <p className="text-sm text-gray-500">Listed by <span className="font-medium text-gray-700">{item.sellerName}</span></p>
                            </div>
                             <button className="text-indigo-600 hover:text-indigo-800 text-sm font-semibold">Contact Seller</button>
                        </li>
                    ))}
                </ul>
            </div>
        )}

        {activeTab === 'payments' && (
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr><th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th><th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Description</th><th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Amount</th><th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th></tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {myPayments.map(payment => (
                            <tr key={payment.id}><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{payment.date}</td><td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{payment.description}</td><td className="px-6 py-4 whitespace-nowrap text-lg font-semibold text-gray-700">{payment.amount}</td><td className="px-6 py-4 whitespace-nowrap text-sm font-semibold"><span className={`px-2 inline-flex text-xs leading-5 rounded-full ${payment.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>{payment.status}</span></td></tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}
      </div>
    </div>
  );
}

export default MyDashboard;