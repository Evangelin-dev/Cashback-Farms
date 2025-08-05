import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../components/Button';
import Card from '../components/Card';
import apiClient from '../src/utils/api/apiClient';
import { Plot, PlotType } from '../types';
import BookPlotPayment from './user/BookPlotPayment';
import { BsFillCheckCircleFill } from 'react-icons/bs';
import { FaUsers, FaWallet } from 'react-icons/fa'; // Icons for the new popup

declare global {
  interface Window {
    Razorpay: any;
  }
}

// --- Helper Components (Unchanged) ---

const DEMO_VIDEO_URL = "https://www.w3schools.com/html/mov_bbb.mp4";
const PlotImageVideo: React.FC<{ imageUrl: string; videoUrl: string; alt: string }> = ({ imageUrl, videoUrl, alt }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hovered, setHovered] = useState(false);
  return (
    <div className="relative w-full max-w-xs h-40 rounded-xl overflow-hidden shadow-lg border-2 border-green-200 group"
      onMouseEnter={() => { setHovered(true); setTimeout(() => videoRef.current?.play(), 100); }}
      onMouseLeave={() => { setHovered(false); videoRef.current?.pause(); if (videoRef.current) videoRef.current.currentTime = 0; }}>
      <img src={imageUrl} alt={alt} className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${hovered ? "opacity-0" : "opacity-100"}`} onError={e => (e.currentTarget.src = 'https://picsum.photos/seed/errorplot/600/400')} />
      <video ref={videoRef} src={videoUrl} className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${hovered ? "opacity-100" : "opacity-0"}`} muted loop playsInline preload="none" poster={imageUrl} />
      {!hovered && (<div className="absolute inset-0 flex items-center justify-center pointer-events-none"><div className="bg-black/40 rounded-full p-2"><svg className="w-7 h-7 text-white opacity-80" fill="currentColor" viewBox="0 0 24 24"><polygon points="9.5,7.5 16.5,12 9.5,16.5" /></svg></div></div>)}
    </div>
  );
};

const PlotOverviewDocs: React.FC<{ docsEnabled: boolean }> = ({ docsEnabled }) => (
  <div className="space-y-2">
    <div className="bg-green-50 rounded p-2 shadow flex items-center gap-2">
      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2a4 4 0 014-4h4a4 4 0 014 4v2M9 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
      <div>
        <div className="font-semibold text-green-700 text-xs">Legal Documents</div>
        <div className="text-xs text-gray-500">View and download plot registry, NOC.</div>
        <div className="flex gap-1 mt-1">
          <span title={!docsEnabled ? 'Pay for Land Document Verification to enable download' : ''}>
            <Button variant="outline" size="sm" disabled={!docsEnabled}>View Registry</Button>
          </span>
          <span title={!docsEnabled ? 'Pay for Land Document Verification to enable download' : ''}>
            <Button variant="outline" size="sm" disabled={!docsEnabled}>Download NOC</Button>
          </span>
        </div>
      </div>
    </div>
    <div className="bg-green-50 rounded p-2 shadow flex items-center gap-2">
      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 7v4a1 1 0 001 1h3m10 0h3a1 1 0 001-1V7m-1 4V7a1 1 0 00-1-1h-3m-10 0H4a1 1 0 00-1 1v4m0 0v6a1 1 0 001 1h3m10 0h3a1 1 0 001-1v-6m-1 6v-6m0 0V7m0 0h-3m-10 0H4" /></svg>
      <div>
        <div className="font-semibold text-green-700 text-xs">Site Plan & Layout</div>
        <div className="text-xs text-gray-500">Download site plan and layout.</div>
        <div className="flex gap-1 mt-1">
          <span title={!docsEnabled ? 'Pay for Land Document Verification to enable download' : ''}>
            <Button variant="outline" size="sm" disabled={!docsEnabled}>View Site Plan</Button>
          </span>
          <span title={!docsEnabled ? 'Pay for Land Document Verification to enable download' : ''}>
            <Button variant="outline" size="sm" disabled={!docsEnabled}>Download Layout</Button>
          </span>
        </div>
      </div>
    </div>
    <div className="bg-green-50 rounded p-2 shadow flex items-center gap-2">
      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3" /><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={2} /></svg>
      <div>
        <div className="font-semibold text-green-700 text-xs">Construction Guidelines</div>
        <div className="text-xs text-gray-500">Short doc on rules, setbacks, approvals.</div>
        <div className="flex gap-1 mt-1">
          <span title={!docsEnabled ? 'Pay for Land Document Verification to enable download' : ''}>
            <Button variant="outline" size="sm" disabled={!docsEnabled}>View Guidelines</Button>
          </span>
        </div>
      </div>
    </div>
  </div>
);

// --- NEW Enquiry Popup Component ---
const EnquiryPopup: React.FC<{ plotTitle: string; onClose: () => void }> = ({ plotTitle, onClose }) => {
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Here you would typically send the data to your backend
        console.log("Enquiry Submitted:", { plot: plotTitle, ...formData });
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
        alert("Thank you for your enquiry! We will get back to you soon.");
        setIsSubmitting(false);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md m-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-green-800">Enquire About "{plotTitle}"</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">×</button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" name="name" placeholder="Your Name" required onChange={handleChange} className="w-full p-2 border rounded" />
                    <input type="email" name="email" placeholder="Your Email" required onChange={handleChange} className="w-full p-2 border rounded" />
                    <input type="tel" name="phone" placeholder="Your Phone Number" required onChange={handleChange} className="w-full p-2 border rounded" />
                    <textarea name="message" placeholder="Your Message" rows={4} required onChange={handleChange} className="w-full p-2 border rounded" />
                    <Button type="submit" variant="primary" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? 'Submitting...' : 'Submit Enquiry'}
                    </Button>
                </form>
            </div>
        </div>
    );
};

// --- NEW Booking Options Popup Component ---
const BookingOptionsPopup: React.FC<{
  onClose: () => void;
  onNormalPayment: () => void;
  onSyndicatePlan: () => void;
}> = ({ onClose, onNormalPayment, onSyndicatePlan }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md m-4 text-center">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-green-800">Choose Your Booking Plan</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">×</button>
                </div>
                <p className="text-gray-600 mb-6">Select how you would like to proceed with booking this plot.</p>
                <div className="space-y-4">
                    <button onClick={onNormalPayment} className="w-full flex items-center justify-center gap-3 p-4 border-2 border-green-600 text-green-700 font-bold rounded-lg hover:bg-green-100 transition">
                        <FaWallet size={20} /> Normal Payment
                    </button>
                    <button onClick={onSyndicatePlan} className="w-full flex items-center justify-center gap-3 p-4 border-2 border-blue-600 text-blue-700 font-bold rounded-lg hover:bg-blue-100 transition">
                        <FaUsers size={20} /> Syndicate Plan (Group Investment)
                    </button>
                </div>
            </div>
        </div>
    );
};


// --- Main Page Component ---
const PlotDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [plot, setPlot] = useState<Plot | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [docsEnabled, setDocsEnabled] = useState(false);
  
  // --- NEW and MODIFIED State ---
  const [showPaymentPopup, setShowPaymentPopup] = useState(false); // For the final payment form
  const [showEnquiryPopup, setShowEnquiryPopup] = useState(false); // For unverified plots
  const [showBookingOptionsPopup, setShowBookingOptionsPopup] = useState(false); // For verified plots

  useEffect(() => {
    if (!id) {
      setError("No plot ID provided in URL.");
      setIsLoading(false);
      return;
    }
    const fetchPlotDetails = async () => {
      const accessToken = localStorage.getItem('access_token');
      if (!accessToken) {
        setError("You must be logged in to view plot details.");
        setIsLoading(false);
        return;
      }
      const headers = { Authorization: `Bearer ${accessToken}` };
      try {
        setIsLoading(true);
        setError(null);
        const response = await apiClient.get(`/plots/${id}/`, { headers });
        const apiPlot = response.data || response;
        const formattedPlot: Plot = {
          id: apiPlot.id,
          title: apiPlot.title,
          location: apiPlot.location,
          area: parseFloat(apiPlot.total_area_sqft),
          sqftPrice: parseFloat(apiPlot.price_per_sqft),
          price: parseFloat(apiPlot.total_area_sqft) * parseFloat(apiPlot.price_per_sqft),
          type: apiPlot.is_verified ? PlotType.VERIFIED : PlotType.PUBLIC,
          imageUrl: apiPlot.plot_file || `https://picsum.photos/seed/${apiPlot.id}/600/400`,
          description: `A prime piece of land located in ${apiPlot.location}, owned by ${apiPlot.owner_name}.`,
          amenities: apiPlot.joint_owners && apiPlot.joint_owners.length > 0 ? ['Joint Ownership'] : [],
          client: apiPlot.owner || 'Unknown Client',
          isAvailable: true,
          value: 0,
          is_verified: apiPlot.is_verified,
        };
        setPlot(formattedPlot);
      } catch (err) {
        setError("Failed to load plot details.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPlotDetails();
  }, [id]);

  const loadRazorpayScript = () => {
    return new Promise<void>((resolve, reject) => {
      if (document.getElementById('razorpay-script')) {
        resolve();
        return;
      }
      const script = document.createElement('script');
      script.id = 'razorpay-script';
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve();
      script.onerror = () => reject('Razorpay SDK failed to load');
      document.body.appendChild(script);
    });
  };

  const handleRazorpayPayment = async () => {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken || !plot) return;

    try {
      await loadRazorpayScript();
      const payload = {
        amount: 5000,
        plot_id: plot.id,
        client: plot.client,
        booking_type: "full_plot"
      };
      const headers = { Authorization: `Bearer ${accessToken}` };
      const res = await apiClient.post("/payments/create-order/", payload, { headers });
      const data = res.data || res;

      if (!data.order_id) {
        alert('Failed to create Razorpay order');
        return;
      }
      const options = {
        key: data.key_id, amount: data.amount, currency: 'INR',
        name: 'Land Document Verification', description: 'Verify land documents before purchase',
        order_id: data.order_id,
        handler: async (response: any) => {
          const verifyRes = await fetch('/api/verify-payment/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded', Authorization: `Bearer ${accessToken}` },
            body: new URLSearchParams({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });
          const verifyData = await verifyRes.json();
          if (verifyData.status === 'Payment verified') {
            alert('✅ Payment Successful');
            setDocsEnabled(true);
          } else {
            alert('❌ Payment verification failed');
          }
        },
        prefill: { name: 'Your Name', email: 'your@email.com', contact: '9876543210' },
        theme: { color: '#22c55e' },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error('Payment error:', err);
      alert('Something went wrong during payment');
    }
  };

  if (isLoading) return <div className="text-center py-20">Loading Plot Details...</div>;
  if (error || !plot) return <div className="text-center py-20 text-red-500">{error || "Plot not found."}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 py-4 px-1">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="relative flex flex-col md:flex-row items-center gap-4 bg-gradient-to-r from-green-100 via-white to-green-200 rounded-2xl shadow-xl p-4 border border-green-200 overflow-hidden">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-extrabold text-green-800 mb-1 flex items-center gap-2"><span className="inline-block w-1 h-6 bg-green-400 rounded-full"></span>{plot.title}</h1>
              {plot.is_verified && (<div title="Verified Plot"><BsFillCheckCircleFill className="text-green-600 text-xl" /></div>)}
            </div>
            <p className="text-base text-green-600 font-semibold mb-1">Plot ID: {plot.id}</p>
            <p className="text-xs text-neutral-500 mb-2">A great investment opportunity.</p>
            <div className="flex items-center gap-2 mt-2">
              {/* --- MODIFIED: Main button is now conditional --- */}
              {plot.is_verified ? (
                <Button variant="primary" size='sm' className="px-3 py-1 text-sm rounded shadow" onClick={() => setShowBookingOptionsPopup(true)}>Book This Plot</Button>
              ) : (
                <Button variant="primary" size='sm' className="px-3 py-1 text-sm rounded shadow" onClick={() => setShowEnquiryPopup(true)}>Make an Enquiry</Button>
              )}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="inline-block bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-semibold shadow">Area: {plot.area} sqft</span>
              <span className="inline-block bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-semibold shadow">Price: ₹{plot.price?.toLocaleString()}</span>
              {plot.amenities && plot.amenities.length > 0 && (<span className="inline-block bg-green-50 text-green-600 px-2 py-0.5 rounded-full text-xs font-semibold shadow"> Amenities: {plot.amenities.join(', ')} </span>)}
            </div>
          </div>
          <div className="flex-1 flex justify-center">
            <PlotImageVideo imageUrl={plot.imageUrl || 'https://picsum.photos/seed/defaultplot/600/400'} videoUrl={DEMO_VIDEO_URL} alt={`Plot ${plot.id}`} />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-4">
            <Card title="Plot Overview" className="bg-white/90 shadow border-0 rounded-xl text-sm">
              <div className="flex flex-col md:flex-row gap-4">
                <img src={plot.imageUrl || 'https://picsum.photos/seed/defaultplot/600/400'} alt={`Plot ${plot.id}`} className="w-full md:w-1/2 h-40 object-cover rounded shadow-md border border-green-100" onError={(e) => (e.currentTarget.src = 'https://picsum.photos/seed/errorplot/600/400')} />
                <div className="md:w-1/2 flex flex-col justify-between">
                  <div>
                    <div className="font-bold text-base mb-1 text-green-700">{plot.title}</div>
                    <div className="text-xs text-gray-600 mb-1">{plot.location}</div>
                    <div className="text-xs text-gray-500 mb-1">{plot.description}</div>
                    <div className="text-sm text-green-700 font-semibold mb-1">₹{plot.price?.toLocaleString()} (~₹{plot.sqftPrice}/sqft)</div>
                    <div className="text-xs text-gray-400">Area: {plot.area} sqft</div>
                    {plot.amenities && (<div className="text-xs text-gray-400 mt-1"><span className="font-semibold text-green-600">Amenities:</span> {plot.amenities.join(', ')}</div>)}
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <PlotOverviewDocs docsEnabled={docsEnabled} />
              </div>
            </Card>
          </div>
          <div className="lg:col-span-1 flex flex-col gap-4">
            <Card title="Why Choose This Plot?" className="bg-green-50 border-0 shadow rounded-xl text-sm">
              <ul className="list-disc pl-4 text-green-700 space-y-1">
                <li>Prime location with excellent connectivity</li>
                <li>Ready for construction</li>
                <li>Clear title and legal documentation</li>
                <li>Flexible payment options</li>
                <li>Gated community with amenities</li>
              </ul>
            </Card>
            {plot?.is_verified && (
              <Card title="Land Document Verification" className="border-0 shadow rounded-xl text-sm ">
                <div className="flex flex-col gap-2">
                  <div className="font-semibold" >Verify the land document before you buy it</div>
                  <div className="text-xs mb-2" >Get peace of mind by verifying the legal status of the land before making your investment.</div>
                  <Button variant="primary" size="sm" className="w-fit px-4 py-1 rounded shadow text-white" style={{ backgroundColor: '#22c55e', border: 'none' }} onClick={handleRazorpayPayment}>
                    Pay ₹5000 for Verification
                  </Button>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
      
      {/* --- NEW: Conditionally render all popups --- */}
      {showEnquiryPopup && plot && (
        <EnquiryPopup plotTitle={plot.title} onClose={() => setShowEnquiryPopup(false)} />
      )}
      
      {showBookingOptionsPopup && (
        <BookingOptionsPopup
            onClose={() => setShowBookingOptionsPopup(false)}
            onNormalPayment={() => {
                setShowBookingOptionsPopup(false); // Close this popup
                setShowPaymentPopup(true);      // Open the payment popup
            }}
            onSyndicatePlan={() => {
                setShowBookingOptionsPopup(false);
                navigate(`/syndicate-plan/${id}`); // Navigate to the syndicate page
            }}
        />
      )}

      {showPaymentPopup && (
        <BookPlotPayment onClose={() => setShowPaymentPopup(false)} />
      )}
    </div>
  );
};

export default PlotDetailsPage;