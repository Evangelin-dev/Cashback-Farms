import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../../components/Button';
import Card from '../../components/common/Cards/Card';
import apiClient from '../../src/utils/api/apiClient';
import { Plot, PlotType } from '../../types';
import BookPlotPayment from './BookPlotPayment';

declare global {
  interface Window {
    Razorpay: any;
  }
}

const DEMO_VIDEO_URL = "https://www.w3schools.com/html/mov_bbb.mp4";

const PlotImageVideo: React.FC<{ imageUrl: string; videoUrl: string; alt: string }> = ({ imageUrl, videoUrl, alt }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hovered, setHovered] = useState(false);
  
  return (
    <div className="relative w-full max-w-sm h-48 rounded-2xl overflow-hidden shadow-xl border-4 border-gradient-to-r from-green-200 to-emerald-300 group transition-all duration-300 hover:shadow-2xl hover:scale-105"
      onMouseEnter={() => { 
        setHovered(true); 
        setTimeout(() => videoRef.current?.play(), 100); 
      }}
      onMouseLeave={() => { 
        setHovered(false); 
        videoRef.current?.pause(); 
        if (videoRef.current) videoRef.current.currentTime = 0; 
      }}>
      <img 
        src={imageUrl} 
        alt={alt} 
        className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ${hovered ? "opacity-0 scale-110" : "opacity-100 scale-100"}`} 
        onError={e => (e.currentTarget.src = 'https://picsum.photos/seed/errorplot/600/400')} 
      />
      <video 
        ref={videoRef} 
        src={videoUrl} 
        className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ${hovered ? "opacity-100 scale-100" : "opacity-0 scale-110"}`} 
        muted 
        loop 
        playsInline 
        preload="none" 
        poster={imageUrl} 
      />
      {!hovered && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-gradient-to-r from-black/60 to-black/40 backdrop-blur-sm rounded-full p-4 animate-pulse">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <polygon points="9.5,7.5 16.5,12 9.5,16.5" />
            </svg>
          </div>
        </div>
      )}
      <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
        HD View
      </div>
    </div>
  );
};

const PlotOverviewDocs: React.FC<{ docsEnabled: boolean }> = ({ docsEnabled }) => (
  <div className="space-y-4">
    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-4 shadow-lg border border-green-200 hover:shadow-xl transition-all duration-300">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 bg-green-100 rounded-xl p-3">
          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2a4 4 0 014-4h4a4 4 0 014 4v2M9 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        </div>
        <div className="flex-1">
          <div className="font-bold text-green-800 text-lg mb-2">Legal Documents</div>
          <div className="text-sm text-gray-600 mb-4 leading-relaxed">
            Access verified legal documentation including plot registry and NOC certificates for complete transparency.
          </div>
          <div className="flex flex-wrap gap-3">
            <span title={!docsEnabled ? 'Pay for Land Document Verification to enable download' : ''}>
              <Button 
                variant="outline" 
                size="sm" 
                disabled={!docsEnabled}
                className="bg-white hover:bg-green-50 border-green-300 text-green-700 px-4 py-2 rounded-lg font-semibold transition-all duration-200 hover:shadow-md disabled:opacity-50"
              >
                📄 View Registry
              </Button>
            </span>
            <span title={!docsEnabled ? 'Pay for Land Document Verification to enable download' : ''}>
              <Button 
                variant="outline" 
                size="sm" 
                disabled={!docsEnabled}
                className="bg-white hover:bg-green-50 border-green-300 text-green-700 px-4 py-2 rounded-lg font-semibold transition-all duration-200 hover:shadow-md disabled:opacity-50"
              >
                📋 Download NOC
              </Button>
            </span>
          </div>
        </div>
      </div>
    </div>

    <div className="bg-gradient-to-r from-blue-50 to-sky-50 rounded-2xl p-4 shadow-lg border border-blue-200 hover:shadow-xl transition-all duration-300">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 bg-blue-100 rounded-xl p-3">
          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v4a1 1 0 001 1h3m10 0h3a1 1 0 001-1V7m-1 4V7a1 1 0 00-1-1h-3m-10 0H4a1 1 0 00-1 1v4m0 0v6a1 1 0 001 1h3m10 0h3a1 1 0 001-1v-6m-1 6v-6m0 0V7m0 0h-3m-10 0H4" />
          </svg>
        </div>
        <div className="flex-1">
          <div className="font-bold text-blue-800 text-lg mb-2">Site Plan & Layout</div>
          <div className="text-sm text-gray-600 mb-4 leading-relaxed">
            Detailed architectural drawings and layout specifications for optimal construction planning.
          </div>
          <div className="flex flex-wrap gap-3">
            <span title={!docsEnabled ? 'Pay for Land Document Verification to enable download' : ''}>
              <Button 
                variant="outline" 
                size="sm" 
                disabled={!docsEnabled}
                className="bg-white hover:bg-blue-50 border-blue-300 text-blue-700 px-4 py-2 rounded-lg font-semibold transition-all duration-200 hover:shadow-md disabled:opacity-50"
              >
                🗺️ View Site Plan
              </Button>
            </span>
            <span title={!docsEnabled ? 'Pay for Land Document Verification to enable download' : ''}>
              <Button 
                variant="outline" 
                size="sm" 
                disabled={!docsEnabled}
                className="bg-white hover:bg-blue-50 border-blue-300 text-blue-700 px-4 py-2 rounded-lg font-semibold transition-all duration-200 hover:shadow-md disabled:opacity-50"
              >
                📐 Download Layout
              </Button>
            </span>
          </div>
        </div>
      </div>
    </div>

    <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-2xl p-4 shadow-lg border border-purple-200 hover:shadow-xl transition-all duration-300">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 bg-purple-100 rounded-xl p-3">
          <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3" />
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={2} />
          </svg>
        </div>
        <div className="flex-1">
          <div className="font-bold text-purple-800 text-lg mb-2">Construction Guidelines</div>
          <div className="text-sm text-gray-600 mb-4 leading-relaxed">
            Comprehensive guidelines covering building rules, setbacks, and approval requirements.
          </div>
          <div className="flex flex-wrap gap-3">
            <span title={!docsEnabled ? 'Pay for Land Document Verification to enable download' : ''}>
              <Button 
                variant="outline" 
                size="sm" 
                disabled={!docsEnabled}
                className="bg-white hover:bg-purple-50 border-purple-300 text-purple-700 px-4 py-2 rounded-lg font-semibold transition-all duration-200 hover:shadow-md disabled:opacity-50"
              >
                📋 View Guidelines
              </Button>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Simple Carousel for Plot Images
const PlotImageCarousel: React.FC<{ images: string[]; alt: string }> = ({ images, alt }) => {
  const [current, setCurrent] = useState(0);
  const total = images.length;
  const prev = () => setCurrent((c) => (c === 0 ? total - 1 : c - 1));
  const next = () => setCurrent((c) => (c === total - 1 ? 0 : c + 1));
  if (total === 0) return null;
  return (
    <div className="relative w-full h-32 rounded-xl overflow-hidden shadow border border-green-100 group">
      <img
        src={images[current]}
        alt={alt}
        className="w-full h-32 object-cover transition-all duration-300"
        onError={e => (e.currentTarget.src = 'https://picsum.photos/seed/errorplot/600/400')}
      />
      {total > 1 && (
        <>
          <button
            className="absolute left-1 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-green-100 text-green-700 rounded-full p-1 shadow text-xs"
            onClick={prev}
            aria-label="Previous"
            type="button"
          >
            ‹
          </button>
          <button
            className="absolute right-1 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-green-100 text-green-700 rounded-full p-1 shadow text-xs"
            onClick={next}
            aria-label="Next"
            type="button"
          >
            ›
          </button>
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-1">
            {images.map((_, i) => (
              <span key={i} className={`w-2 h-2 rounded-full ${i === current ? 'bg-green-500' : 'bg-green-200'}`}></span>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const PlotDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [plot, setPlot] = useState<Plot | null>(null);
  // Demo: Replace with real images from API if available
  const [plotImages, setPlotImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const [showSyndicatePopup, setShowSyndicatePopup] = useState(false);
  const [showPaymentChoice, setShowPaymentChoice] = useState(false);
  const [docsEnabled, setDocsEnabled] = useState(false);
  const [isAdminPlot, setIsAdminPlot] = useState(false);

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
        
        // Check if this is an admin plot (Greenheap Cashback Farms)
        const isAdmin = apiPlot.owner_name === 'Greenheap Cashback Farms' || apiPlot.client === 'Greenheap Cashback Farms';
        setIsAdminPlot(isAdmin);
        
        const formattedPlot: Plot = {
          id: apiPlot.id?.toString() || '',
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
        };
        setPlot(formattedPlot);
        // Demo: Use multiple images if available, else fallback
        const images: string[] = [];
        if (apiPlot.plot_files && Array.isArray(apiPlot.plot_files) && apiPlot.plot_files.length > 0) {
          images.push(...apiPlot.plot_files);
        } else if (apiPlot.plot_file) {
          images.push(apiPlot.plot_file);
        }
        // Add fallback/demo images if not enough
        while (images.length < 3) {
          images.push(`https://picsum.photos/seed/${apiPlot.id || Math.random()}/${600 + images.length}/${400 + images.length}`);
        }
        setPlotImages(images);
      } catch (err) {
        setError("Failed to load plot details. It might not exist or you may not have permission.");
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
        key: data.key_id,
        amount: data.amount,
        currency: 'INR',
        name: 'Land Document Verification',
        description: 'Verify land documents before purchase',
        order_id: data.order_id,
        handler: async (response: any) => {
          const verifyRes = await fetch('/api/verify-payment/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              Authorization: `Bearer ${accessToken}`,
            },
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
        prefill: {
          name: 'Your Name',
          email: 'your@email.com',
          contact: '9876543210',
        },
        theme: {
          color: '#22c55e',
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error('Payment error:', err);
      alert('Something went wrong during payment');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-200 border-t-green-600 mx-auto mb-4"></div>
          <div className="text-xl font-semibold text-green-700">Loading Plot Details...</div>
        </div>
      </div>
    );
  }

  if (error || !plot) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-100 flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl shadow-xl p-8 max-w-md">
          <div className="text-6xl mb-4">❌</div>
          <div className="text-xl font-semibold text-red-600 mb-2">Plot Not Found</div>
          <div className="text-gray-600">{error || "Plot not found."}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-100 py-6 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-green-100 via-white to-emerald-200 rounded-xl shadow-2xl p-3 md:p-4 border border-green-200 overflow-hidden text-sm">
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-200/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-emerald-200/40 rounded-full blur-2xl"></div>
          
          <div className="relative flex flex-col lg:flex-row items-center gap-4">
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-1 h-6 bg-gradient-to-b from-green-400 to-emerald-600 rounded-full"></div>
                <h1 className="text-xl md:text-2xl font-bold text-green-800">{plot.title}</h1>
              </div>
              
              <div className="space-y-1">
                <p className="text-xs text-green-600 font-semibold flex items-center gap-1">
                  <span className="bg-green-100 px-2 py-0.5 rounded text-xs">Plot ID:</span>
                  {plot.id}
                </p>
                <p className="text-gray-600 leading-snug text-xs">{plot.description}</p>
                <p className="text-xs text-gray-500 italic">📍 {plot.location}</p>
              </div>

              <div className="flex flex-wrap gap-2 my-2">
                <span className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 px-2 py-1 rounded text-xs font-bold shadow border border-green-200">
                  📏 Area: {plot.area} sqft
                </span>
                <span className="bg-gradient-to-r from-blue-100 to-sky-100 text-blue-800 px-2 py-1 rounded text-xs font-bold shadow border border-blue-200">
                  💰 Price: ₹{plot.price?.toLocaleString()}
                </span>
                <span className="bg-gradient-to-r from-purple-100 to-violet-100 text-purple-800 px-2 py-1 rounded text-xs font-bold shadow border border-purple-200">
                  📊 Rate: ₹{plot.sqftPrice}/sqft
                </span>
                {plot.amenities && plot.amenities.length > 0 && (
                  <span className="bg-gradient-to-r from-orange-100 to-amber-100 text-orange-800 px-2 py-1 rounded text-xs font-bold shadow border border-orange-200">
                    ✨ {plot.amenities.join(', ')}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                <Button 
                  variant="primary" 
                  size="sm"
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-4 py-2 rounded-xl font-bold shadow hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-xs"
                  onClick={() => setShowPaymentChoice(true)}
                >
                  🚀 Book Now
                </Button>
                <Button 
                  variant="outline"
                  size="sm"
                  className="border border-green-300 text-green-700 hover:bg-green-50 px-4 py-2 rounded-xl font-semibold shadow hover:shadow-xl transition-all duration-300 text-xs"
                >
                  📞 Contact Seller
                </Button>
              </div>
            </div>
            
            <div className="flex-1 flex justify-center lg:justify-end">
              <PlotImageVideo 
                imageUrl={plot.imageUrl || 'https://picsum.photos/seed/defaultplot/600/400'} 
                videoUrl={DEMO_VIDEO_URL} 
                alt={`Plot ${plot.id}`} 
              />
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
  <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          {/* Left Column - Plot Details */}
          <div className="xl:col-span-2 space-y-3">
            <Card 
              title="Plot Overview" 
              className="bg-white/95 backdrop-blur-sm shadow-xl border-0 rounded-xl overflow-hidden"
            >
              <div className="space-y-3">
                <div className="flex flex-col md:flex-row gap-3">
                  <div className="md:w-1/2">
                    <PlotImageCarousel images={plotImages} alt={`Plot ${plot.id}`} />
                  </div>
                  <div className="md:w-1/2 space-y-2">
                    <div>
                      <h3 className="text-lg font-bold text-green-800 mb-1">{plot.title}</h3>
                      <p className="text-green-600 font-semibold mb-1 text-xs">📍 {plot.location}</p>
                      <p className="text-gray-600 leading-snug text-xs">{plot.description}</p>
                    </div>
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-2 border border-green-200">
                      <div className="text-lg font-bold text-green-800 mb-1">
                        ₹{plot.price?.toLocaleString()}
                      </div>
                      <div className="text-xs text-green-600">
                        (~₹{plot.sqftPrice}/sqft)
                      </div>
                      <div className="text-[10px] text-gray-500 mt-1">
                        Total Area: {plot.area} square feet
                      </div>
                    </div>
                    {plot.amenities && plot.amenities.length > 0 && (
                      <div className="bg-blue-50 rounded-xl p-2 border border-blue-200">
                        <div className="font-semibold text-blue-800 mb-1 text-xs">🏆 Amenities</div>
                        <div className="text-xs text-blue-700">{plot.amenities.join(', ')}</div>
                      </div>
                    )}
                  </div>
                </div>
                {/* Conditional Documents Section - Only for Admin Plots */}
                {isAdminPlot && (
                  <div className="border-t border-gray-200 pt-3">
                    <div className="mb-3">
                      <h3 className="text-base font-bold text-gray-800 mb-1">📋 Documentation & Planning</h3>
                      <p className="text-gray-600 text-xs">Complete legal and technical documentation for your peace of mind</p>
                    </div>
                    <PlotOverviewDocs docsEnabled={docsEnabled} />
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Right Column - Sidebar */}
          <div className="xl:col-span-1 space-y-3">
            <Card 
              title="Why Choose This Plot?" 
              className="bg-gradient-to-br from-green-50 to-emerald-50 border-0 shadow-xl rounded-xl"
            >
              <div className="space-y-2">
                {[
                  { icon: "🌟", text: "Prime location with excellent connectivity" },
                  { icon: "🏗️", text: "Ready for construction" },
                  { icon: "📜", text: "Clear title and legal documentation" },
                  { icon: "💳", text: "Flexible payment options" },
                  { icon: "🏘️", text: "Gated community with amenities" },
                  { icon: "📈", text: "High investment potential" }
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-white/60 rounded border border-green-200 hover:shadow-md transition-all duration-200 text-xs">
                    <span className="text-base">{item.icon}</span>
                    <span className="text-green-800 font-medium">{item.text}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Conditional Land Document Verification - Only for Admin Plots */}
            {isAdminPlot && (
              <Card 
                title="🔒 Land Document Verification" 
                className="bg-gradient-to-br from-orange-50 to-amber-50 border-0 shadow-xl rounded-xl"
              >
                <div className="space-y-2">
                  <div className="bg-white/80 rounded-xl p-2 border border-orange-200">
                    <h4 className="font-bold text-orange-800 text-base mb-1">
                      🛡️ Secure Your Investment
                    </h4>
                    <p className="text-xs text-gray-700 mb-2 leading-snug">
                      Get complete peace of mind with our comprehensive legal verification service. 
                      Verify land ownership, check for liens, and ensure clear title before making your investment.
                    </p>
                    <div className="space-y-1 mb-2">
                      {[
                        "✅ Title deed verification",
                        "✅ Encumbrance certificate check",
                        "✅ Survey settlement verification",
                        "✅ Legal opinion report"
                      ].map((item, index) => (
                        <div key={index} className="text-[10px] text-green-700 font-medium">{item}</div>
                      ))}
                    </div>
                    <Button
                      variant="primary"
                      size="sm"
                      className="w-full bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white px-3 py-2 rounded-xl font-bold shadow hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-xs"
                      onClick={handleRazorpayPayment}
                    >
                      💰 Pay ₹5,000 for Verification
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {/* Investment Calculator */}
            <Card 
              title="📊 Investment Calculator" 
              className="bg-gradient-to-br from-blue-50 to-sky-50 border-0 shadow-xl rounded-xl"
            >
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-white/80 rounded p-2 text-center border border-blue-200">
                    <div className="text-xs text-gray-600 mb-1">Per Sqft</div>
                    <div className="font-bold text-blue-800 text-sm">₹{plot.sqftPrice}</div>
                  </div>
                  <div className="bg-white/80 rounded p-2 text-center border border-blue-200">
                    <div className="text-xs text-gray-600 mb-1">Total Area</div>
                    <div className="font-bold text-blue-800 text-sm">{plot.area} sqft</div>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-blue-100 to-sky-100 rounded p-2 border-2 border-blue-300">
                  <div className="text-center">
                    <div className="text-xs text-blue-600 mb-1">Total Investment</div>
                    <div className="text-lg font-bold text-blue-800">₹{plot.price?.toLocaleString()}</div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Payment Choice Modal */}
      {showPaymentChoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in-fast p-2">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-xs mx-auto relative animate-slide-up overflow-hidden text-xs">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-3 relative">
              <button
                className="absolute top-2 right-2 text-white/80 hover:text-white text-xl font-bold transition-colors duration-200"
                onClick={() => setShowPaymentChoice(false)}
                aria-label="Close"
                type="button"
              >
                ×
              </button>
              <div className="text-center">
                <div className="text-xl mb-1">💳</div>
                <h2 className="text-base font-bold text-white">Choose Payment Method</h2>
                <p className="text-green-100 text-xs mt-1">Select your preferred payment option</p>
              </div>
            </div>

            {/* Content */}
            <div className="p-3 space-y-2">
              <button
                className="w-full group relative bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white p-2 rounded-xl font-bold shadow hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-xs"
                onClick={() => { setShowPaymentChoice(false); setShowPaymentPopup(true); }}
              >
                <div className="flex items-center justify-center gap-2">
                  <span className="text-lg">🏦</span>
                  <div className="text-left">
                    <div className="font-bold text-xs">Normal Payment</div>
                    <div className="text-green-100 text-[10px]">Direct plot purchase</div>
                  </div>
                </div>
                <div className="absolute top-1 right-1 bg-white/20 rounded-full px-2 py-0.5 text-[10px]">
                  Recommended
                </div>
              </button>

              <button
                className="w-full group bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white p-2 rounded-xl font-bold shadow hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-xs"
                onClick={() => {
                  setShowPaymentChoice(false);
                  navigate('/user/syndicate-plot');
                }}
              >
                <div className="flex items-center justify-center gap-2">
                  <span className="text-lg">👥</span>
                  <div className="text-left">
                    <div className="font-bold text-xs">Syndicate Plot</div>
                    <div className="text-blue-100 text-[10px]">Shared investment option</div>
                  </div>
                </div>
              </button>

             
            </div>
          </div>
        </div>
      )}

      {/* Payment Popup */}
      {showPaymentPopup && (
        <BookPlotPayment onClose={() => setShowPaymentPopup(false)} />
      )}
    </div>
  );
};

export default PlotDetailsPage;