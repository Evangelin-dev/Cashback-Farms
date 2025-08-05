import React, { useState, useEffect, useCallback } from 'react';
import { BriefcaseIcon, StarIcon, CurrencyDollarIcon, MapPinIcon, UsersIcon, PhoneIcon, EnvelopeIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import apiClient from '@/src/utils/api/apiClient';
import { message } from 'antd';

// --- INTERFACES ---
type PropertyStatus = 'Available' | 'Unavailable';

interface Property {
  id: string;
  title: string;
  location: string;
  status: PropertyStatus;
  pricePerSqft: string;
  totalArea: string;
  is_available_full: boolean;
  imageUrl: string | null;
}

interface MicroPlot {
  id: number;
  project_name: string;
  location: string;
  google_map_link?: string;
  description?: string;
  plot_type: 'Residential' | 'Commercial' | 'Plot' | 'Villa' | 'Skyrise';
  unit: 'sqft' | 'sqyd';
  price: string;
  project_layout?: string | null;
  project_image?: string | null;
  project_video?: string | null;
  land_document?: string | null;
}

interface IShortlist {
  plot_id: number;
  plot_title: string;
  plot_location: string;
  buyer_name: string;
  buyer_email: string;
  buyer_phone: string;
  shortlisted_at: string;
}

// --- COMPONENTS ---
const Loader = () => (
  <div className="flex justify-center items-center p-10">
    <div className="w-8 h-8 border-4 border-dashed rounded-full animate-spin border-green-600"></div>
  </div>
);

const MyDashboard: React.FC = () => {
  // --- STATE MANAGEMENT ---
  const [activeTab, setActiveTab] = useState<string>('listings');
  const [listingType, setListingType] = useState<'plots' | 'microplots'>('plots');

  const [properties, setProperties] = useState<Property[]>([]);
  const [microPlots, setMicroPlots] = useState<MicroPlot[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [shortlistedData, setShortlistedData] = useState<IShortlist[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Property | MicroPlot | null>(null);
  const [formState, setFormState] = useState<any>({});

  // State for file inputs in the modal
  const [editingFiles, setEditingFiles] = useState<Record<string, File | null>>({});


  const myPayments = [
    { id: 'txn_12345', date: '2023-09-20', description: 'Listing Fee', amount: '₹5,000', status: 'Completed' as const },
    { id: 'txn_12346', date: '2023-08-15', description: 'Premium Membership', amount: '₹15,000', status: 'Completed' as const }
  ];


  // --- DATA FETCHING ---
  const fetchPlots = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await apiClient.get<any[]>("/plots/");
      const mappedProperties: Property[] = (res || []).map((plot: any) => ({
        id: plot.id.toString(),
        title: plot.title,
        location: plot.location,
        status: plot.is_available_full ? 'Available' : 'Unavailable',
        pricePerSqft: `₹${Number(plot.price_per_sqft).toLocaleString("en-IN")}`,
        totalArea: `${Number(plot.total_area_sqft).toLocaleString("en-IN")} sq.ft`,
        is_available_full: plot.is_available_full,
        imageUrl: plot.plot_file,
      }));
      setProperties(mappedProperties.reverse());
    } catch (err) {
      console.error("Failed to fetch plots:", err);
      setProperties([]);
    } finally {
      setIsLoading(false);
    }
  }, []);



    const fetchShortlistedData = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await apiClient.get<IShortlist[]>("/owner/shortlisted/");
      setShortlistedData(Array.isArray(res) ? res : []);
    } catch (err) {
      console.error("Failed to fetch shortlisted data:", err);
      message.error("Could not fetch inquiries and shortlisted data.");
      setShortlistedData([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'listings') {
      if (listingType === 'plots') {
        fetchPlots();
      }
    } else if (activeTab === 'inquiries' || activeTab === 'shortlisted') {
      fetchShortlistedData();
    }
  }, [activeTab, listingType, fetchPlots, fetchShortlistedData]);

  // --- GENERALIZED CRUD & MODAL ---
  const openEditModal = (item: Property | MicroPlot) => {
    setEditingItem(item);
    setFormState(item);
    setEditingFiles({}); // Reset files on open
    setIsModalOpen(true);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setEditingFiles(prev => ({ ...prev, [name]: files[0] }));
    }
  };

  const handleDelete = async (item: Property | MicroPlot) => {
    const isMicro = 'project_name' in item;
    const endpoint = isMicro ? `/sqlft-projects/${item.id}/` : `/plots/${item.id}/`;
    const type = isMicro ? 'Microplot' : 'Plot';

    if (window.confirm(`Are you sure you want to delete this ${type}?`)) {
      try {
        await apiClient.delete(endpoint);
        message.success(`${type} deleted successfully!`);
        fetchPlots();
      } catch (error) {
        message.error(`Failed to delete ${type}.`);
      }
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    const isMicro = 'project_name' in editingItem;
    const endpoint = isMicro ? `/sqlft-projects/${editingItem.id}/` : `/plots/${editingItem.id}/`;
    const type = isMicro ? 'Microplot' : 'Plot';

    const formData = new FormData();

    // Append only changed text/number fields
    Object.entries(formState).forEach(([key, value]) => {
      if (value !== editingItem[key as keyof typeof editingItem]) {
        formData.append(key, value as string);
      }
    });

    // Append any new files
    Object.entries(editingFiles).forEach(([key, file]) => {
      if (file) {
        formData.append(key, file);
      }
    });

    if (formData.entries().next().done) {
      message.info("No changes were made.");
      setIsModalOpen(false);
      return;
    }

    try {
      // Use PATCH for partial updates, PUT requires all fields
      await apiClient.patch(endpoint, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      message.success(`${type} updated successfully!`);
      setIsModalOpen(false);
      fetchPlots();
    } catch (error) {
      console.error(`Failed to update ${type}:`, error);
      message.error(`Failed to update ${type}. Check console for details.`);
    }
  };


  // --- Helper Functions ---
  const getTabClass = (tabName: string) => {
    return activeTab === tabName
      ? 'bg-green-100 text-green-700 border-green-600'
      : 'text-gray-500 border-transparent hover:bg-gray-100 hover:border-gray-300';
  };

  const getStatusBadge = (status: PropertyStatus) => {
    const styles: Record<PropertyStatus, string> = {
      Available: 'bg-green-100 text-green-800',
      Unavailable: 'bg-red-100 text-red-800',
    };
    return styles[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="p-4 sm:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Dashboard</h1>
      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-2 sm:space-x-6 overflow-x-auto" aria-label="Tabs">
            <button onClick={() => setActiveTab('listings')} className={`flex items-center gap-2 px-3 py-2 font-semibold text-sm rounded-t-md border-b-2 ${getTabClass('listings')}`}><BriefcaseIcon className="h-5 w-5" /> My Listings</button>
            <button onClick={() => setActiveTab('inquiries')} className={`flex items-center gap-2 px-3 py-2 font-semibold text-sm rounded-t-md border-b-2 ${getTabClass('inquiries')}`}><UsersIcon className="h-5 w-5" /> Interested Inquiries</button>
            <button onClick={() => setActiveTab('shortlisted')} className={`flex items-center gap-2 px-3 py-2 font-semibold text-sm rounded-t-md border-b-2 ${getTabClass('shortlisted')}`}><StarIcon className="h-5 w-5" /> My Shortlisted</button>
            <button onClick={() => setActiveTab('payments')} className={`flex items-center gap-2 px-3 py-2 font-semibold text-sm rounded-t-md border-b-2 ${getTabClass('payments')}`}><CurrencyDollarIcon className="h-5 w-5" /> My Payments</button>
          </nav>
        </div>
      </div>
      <div>
        {activeTab === 'listings' && (
          <div>
            {isLoading ? <Loader /> : (
              <>
                {listingType === 'plots' && (
                  properties.length > 0 ? (
                    <div className="space-y-6">
                      {properties.map(prop => (
                        <div key={prop.id} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden flex flex-col sm:flex-row">
                          <img src={prop.imageUrl || 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=1974&auto=format&fit=crop'} alt={prop.title} className="h-48 w-full sm:h-auto sm:w-56 object-cover" />
                          <div className="p-5 flex flex-col flex-grow">
                            <div className="flex justify-between items-start">
                              <h3 className="text-xl font-semibold text-gray-800">{prop.title}</h3>
                              <span className={`text-xs font-bold px-3 py-1 rounded-full ${getStatusBadge(prop.status)}`}>{prop.status}</span>
                            </div>
                            <p className="flex items-center gap-1 text-sm text-gray-500 mt-1 mb-4"><MapPinIcon className="h-4 w-4" /> {prop.location}</p>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2 border-t border-gray-100 pt-4">
                              <div><p className="text-xs text-gray-500">Price</p><p className="font-semibold text-gray-800">{prop.pricePerSqft}</p></div>
                              <div><p className="text-xs text-gray-500">Total Area</p><p className="font-semibold text-gray-800">{prop.totalArea}</p></div>
                            </div>
                            <div className="mt-auto pt-4 flex justify-end items-center gap-2">
                              <button onClick={() => openEditModal(prop)} className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-semibold text-xs p-2 rounded-md hover:bg-blue-50"><PencilIcon className="h-4 w-4" /> Edit</button>
                              <button onClick={() => handleDelete(prop)} className="flex items-center gap-1 text-red-600 hover:text-red-800 font-semibold text-xs p-2 rounded-md hover:bg-red-50"><TrashIcon className="h-4 w-4" /> Delete</button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : <p className="text-center text-gray-500 py-10">You have not listed any plots yet.</p>
                )}
                {listingType === 'microplots' && (
                  microPlots.length > 0 ? (
                    <div className="space-y-6">
                      {microPlots.map(plot => (
                        <div key={plot.id} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden flex flex-col sm:flex-row">
                          <img src={plot.project_image || 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=1974&auto=format&fit=crop'} alt={plot.project_name} className="h-48 w-full sm:h-auto sm:w-56 object-cover" />
                          <div className="p-5 flex flex-col flex-grow">
                            <h3 className="text-xl font-semibold text-gray-800">{plot.project_name}</h3>
                            <p className="flex items-center gap-1 text-sm text-gray-500 mt-1 mb-4"><MapPinIcon className="h-4 w-4" /> {plot.location}</p>
                            <div className="grid grid-cols-2 gap-4 mt-2 border-t border-gray-100 pt-4">
                              <div><p className="text-xs text-gray-500">Price</p><p className="font-semibold text-gray-800">₹{Number(plot.price).toLocaleString("en-IN")} / {plot.unit}</p></div>
                              <div><p className="text-xs text-gray-500">Type</p><p className="font-semibold text-gray-800">{plot.plot_type}</p></div>
                            </div>
                            <div className="mt-auto pt-4 flex justify-end items-center gap-2">
                              <button onClick={() => openEditModal(plot)} className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-semibold text-xs p-2 rounded-md hover:bg-blue-50"><PencilIcon className="h-4 w-4" /> Edit</button>
                              <button onClick={() => handleDelete(plot)} className="flex items-center gap-1 text-red-600 hover:text-red-800 font-semibold text-xs p-2 rounded-md hover:bg-red-50"><TrashIcon className="h-4 w-4" /> Delete</button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : <p className="text-center text-gray-500 py-10">You have not listed any microplots yet.</p>
                )}
              </>
            )}
          </div>
        )}
         {activeTab === 'inquiries' && (
           <div>
             {isLoading ? <Loader /> : shortlistedData.length > 0 ? (
               <div className="space-y-5">
                 {shortlistedData.map(item => (
                   <div key={`${item.plot_id}-${item.buyer_email}`} className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold text-indigo-700">{item.buyer_name}</h3>
                          <p className="text-sm text-gray-600 mt-1">Is interested in: <span className="font-medium">{item.plot_title}</span></p>
                        </div>
                        <p className="text-xs text-gray-500">Inquired on: {new Date(item.shortlisted_at).toLocaleDateString()}</p>
                      </div>
                      <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-start gap-4 flex-wrap">
                         <a href={`https://wa.me/${item.buyer_phone}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-green-600"><PhoneIcon className="h-4 w-4"/>{item.buyer_phone}</a>
                         <a href={`mailto:${item.buyer_email}`} className="inline-flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-green-600"><EnvelopeIcon className="h-4 w-4"/> {item.buyer_email}</a>
                      </div>
                   </div>
                 ))}
               </div>
             ) : (
               <p className="text-center text-gray-500 py-10">No inquiries found for your properties.</p>
             )}
           </div>
        )}

        {activeTab === 'shortlisted' && (
          <div>
            {isLoading ? <Loader /> : shortlistedData.length > 0 ? (
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                  <ul className="divide-y divide-gray-200">
                      {shortlistedData.map(item => (
                          <li key={`${item.plot_id}-${item.buyer_email}`} className="p-4 flex justify-between items-center hover:bg-gray-50">
                              <div>
                                  <p className="font-semibold text-gray-800">{item.plot_title}</p>
                                  <p className="text-sm text-gray-500 flex items-center gap-1.5 mt-1"><MapPinIcon className="h-4 w-4 text-gray-400"/> {item.plot_location}</p>
                              </div>
                              <p className="text-sm text-gray-500">Inquired by: <span className="font-medium text-gray-700">{item.buyer_name}</span></p>
                          </li>
                      ))}
                  </ul>
              </div>
            ) : (
              <p className="text-center text-gray-500 py-10">No properties have been shortlisted by buyers yet.</p>
            )}
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

      {isModalOpen && editingItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-full overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-800 p-6 border-b">Edit {'project_name' in editingItem ? 'Microplot' : 'Plot'}</h2>
            <form onSubmit={handleUpdate} className="p-6 space-y-4">
              {'project_name' in editingItem ? (
                <>
                  <div><label className="text-sm font-medium">Project Name</label><input type="text" name="project_name" value={formState.project_name || ''} onChange={handleFormChange} className="mt-1 w-full p-2 border rounded-md" /></div>
                  <div><label className="text-sm font-medium">Location</label><input type="text" name="location" value={formState.location || ''} onChange={handleFormChange} className="mt-1 w-full p-2 border rounded-md" /></div>
                  <div><label className="text-sm font-medium">Google Map Link</label><input type="text" name="google_map_link" value={formState.google_map_link || ''} onChange={handleFormChange} className="mt-1 w-full p-2 border rounded-md" /></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="text-sm font-medium">Price</label><input type="number" name="price" value={formState.price || ''} onChange={handleFormChange} className="mt-1 w-full p-2 border rounded-md" /></div>
                    <div><label className="text-sm font-medium">Unit</label><select name="unit" value={formState.unit || 'sqft'} onChange={handleFormChange} className="mt-1 w-full p-2 border rounded-md bg-white"><option value="sqft">sqft</option><option value="sqyd">sqyd</option></select></div>
                  </div>
                  <div><label className="text-sm font-medium">Project Type</label><select name="plot_type" value={formState.plot_type || 'Plot'} onChange={handleFormChange} className="mt-1 w-full p-2 border rounded-md bg-white"><option value="Plot">Plot</option><option value="Villa">Villa</option><option value="Skyrise">Skyrise</option><option value="Residential">Residential</option><option value="Commercial">Commercial</option></select></div>
                  <div><label className="text-sm font-medium">Description</label><textarea name="description" value={formState.description || ''} onChange={handleFormChange} className="mt-1 w-full p-2 border rounded-md" rows={3}></textarea></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="text-sm font-medium">Project Layout</label><input type="file" name="project_layout" onChange={handleFileChange} className="mt-1 w-full text-sm" /></div>
                    <div><label className="text-sm font-medium">Project Image</label><input type="file" name="project_image" onChange={handleFileChange} className="mt-1 w-full text-sm" /></div>
                    <div><label className="text-sm font-medium">Project Video</label><input type="file" name="project_video" onChange={handleFileChange} className="mt-1 w-full text-sm" /></div>
                    <div><label className="text-sm font-medium">Land Document</label><input type="file" name="land_document" onChange={handleFileChange} className="mt-1 w-full text-sm" /></div>
                  </div>
                </>
              ) : (
                <>
                  <div><label className="text-sm font-medium">Title</label><input type="text" name="title" value={formState.title || ''} onChange={handleFormChange} className="mt-1 w-full p-2 border rounded-md" /></div>
                  <div><label className="text-sm font-medium">Location</label><input type="text" name="location" value={formState.location || ''} onChange={handleFormChange} className="mt-1 w-full p-2 border rounded-md" /></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="text-sm font-medium">Price per SqFt</label><input type="number" name="price_per_sqft" value={formState.price_per_sqft || ''} onChange={handleFormChange} className="mt-1 w-full p-2 border rounded-md" /></div>
                    <div><label className="text-sm font-medium">Total Area (sqft)</label><input type="number" name="total_area_sqft" value={formState.total_area_sqft || ''} onChange={handleFormChange} className="mt-1 w-full p-2 border rounded-md" /></div>
                  </div>
                  <div><label className="text-sm font-medium">Image</label><input type="file" name="plot_file" onChange={handleFileChange} className="mt-1 w-full text-sm" /></div>
                </>
              )}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md font-semibold hover:bg-gray-300">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-md font-semibold hover:bg-green-700">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyDashboard;