// This is a simplified version of your component, focused on fetching and displaying a single plot.
// Helper components like PlotImageVideo and PlotOverviewDocs are assumed to be in the same file or imported.
import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import apiClient from '../../../src/utils/api/apiClient';
import Button from '../../../components/common/Button';
import Card from '../../../components/Card';
import { Plot, PlotType } from '../../../types'; // Ensure Plot and PlotType are correctly defined
import { FaSpinner } from 'react-icons/fa'; // Example for loading spinner
import { useAuth } from '../../../contexts/AuthContext'; // 1. IMPORT a custom hook

// --- Helper Components (Full Code Included) ---

const DEMO_VIDEO_URL = "https://www.w3schools.com/html/mov_bbb.mp4";

const PlotImageVideo: React.FC<{ imageUrl: string; videoUrl: string; alt: string }> = ({ imageUrl, videoUrl, alt }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative w-full max-w-xs h-40 rounded-xl overflow-hidden shadow-lg border-2 border-green-200 group"
      onMouseEnter={() => {
        setHovered(true);
        setTimeout(() => videoRef.current?.play(), 100);
      }}
      onMouseLeave={() => {
        setHovered(false);
        if (videoRef.current) {
          videoRef.current.pause();
          videoRef.current.currentTime = 0;
        }
      }}
    >
      <img
        src={imageUrl}
        alt={alt}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${hovered ? "opacity-0" : "opacity-100"}`}
        onError={e => (e.currentTarget.src = 'https://picsum.photos/seed/errorplot/600/400')}
      />
      <video
        ref={videoRef}
        src={videoUrl}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${hovered ? "opacity-100" : "opacity-0"}`}
        muted
        loop
        playsInline
        preload="none"
        poster={imageUrl}
      />
      {!hovered && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-black/40 rounded-full p-2">
            <svg className="w-7 h-7 text-white opacity-80" fill="currentColor" viewBox="0 0 24 24">
              <polygon points="9.5,7.5 16.5,12 9.5,16.5" />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
};

const PlotOverviewDocs: React.FC<{ plot: Plot; onAuthAction: () => void }> = ({ plot, onAuthAction }) => (
    <div className="space-y-2">
      <div className="bg-green-50 rounded p-2 shadow flex items-center gap-2">
        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2a4 4 0 014-4h4a4 4 0 014 4v2M9 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
        <div>
          <div className="font-semibold text-green-700 text-xs">Legal Documents</div>
          <div className="text-xs text-gray-500">View plot registry, NOC, etc.</div>
          <div className="flex gap-1 mt-1">
            <Button variant="outline" size="sm" onClick={onAuthAction}>View Registry</Button>
            <Button variant="outline" size="sm" onClick={onAuthAction}>Download NOC</Button>
          </div>
        </div>
      </div>
      <div className="bg-green-50 rounded p-2 shadow flex items-center gap-2">
        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 7v4a1 1 0 001 1h3m10 0h3a1 1 0 001-1V7m-1 4V7a1 1 0 00-1-1h-3m-10 0H4a1 1 0 00-1 1v4m0 0v6a1 1 0 001 1h3m10 0h3a1 1 0 001-1v-6m-1 6v-6m0 0V7m0 0h-3m-10 0H4" /></svg>
        <div>
          <div className="font-semibold text-green-700 text-xs">Site Plan & Layout</div>
           <div className="text-xs text-gray-500">View site plan and layout.</div>
          <div className="flex gap-1 mt-1">
            <Button variant="outline" size="sm" onClick={onAuthAction}>View Site Plan</Button>
          </div>
        </div>
      </div>
    </div>
);


// --- Main Component ---

const DPlotBookingDetailsPage: React.FC = () => {
  const { plotId } = useParams<{ plotId: string }>();
  const [plot, setPlot] = useState<Plot | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  // 2. GET THE CURRENT USER FROM THE AUTH CONTEXT
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!plotId) {
      setError("No Plot ID provided in the URL.");
      setIsLoading(false);
      return;
    }

    const fetchPlot = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await apiClient.get(`/public/plots/${plotId}/`);
        const apiPlot = response; // Use response.data

        const mappedPlot: Plot = {
          id: apiPlot.id,
          title: apiPlot.title,
          location: apiPlot.location,
          area: Number(apiPlot.total_area_sqft),
          price: Number(apiPlot.price_per_sqft),
          sqftPrice: Number(apiPlot.price_per_sqft),
          imageUrl: apiPlot.plot_file || `https://picsum.photos/seed/${apiPlot.id}/600/400`,
          description: apiPlot.description || `A prime plot located in ${apiPlot.location}, perfect for investment or building your dream home.`,
          isVerified: apiPlot.is_verified,
          amenities: [],
          type: apiPlot.is_verified ? PlotType.VERIFIED : PlotType.PUBLIC,
        };
        setPlot(mappedPlot);
      } catch (err) {
        console.error("Failed to fetch plot details:", err);
        setError("This plot could not be found or there was a problem loading its details.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlot();
  }, [plotId]);

  // 3. CREATE A HANDLER FOR PROTECTED ACTIONS
  const handleProtectedAction = () => {
    if (!currentUser) {
      // If no user is logged in, show the popup
      setShowLoginPopup(true);
    } else {
      navigate(`/book-my-sqft/${plotId}`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-green-50">
        <FaSpinner className="animate-spin text-green-700 text-5xl" />
      </div>
    );
  }

  if (error || !plot) {
    return (
      <div className="flex justify-center items-center h-screen bg-red-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-red-600">Error</h2>
          <p className="mt-2 text-gray-600">{error || "Plot data is unavailable."}</p>
          <Link to="/plots">
             <Button variant="primary" className="mt-4">Back to Marketplace</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 py-4 px-1">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="relative flex flex-col md:flex-row items-center gap-4 bg-gradient-to-r from-green-100 via-white to-green-200 rounded-2xl shadow-xl p-4 border border-green-200">
            <div className="flex-1">
              <h1 className="text-2xl font-extrabold text-green-800">{plot.title}</h1>
              <p className="text-base text-green-600 font-semibold mb-1">Plot ID: {plot.id}</p>
              <div className="flex items-center gap-2 mt-2">
                {/* 4. USE THE NEW HANDLER ON ALL PROTECTED BUTTONS */}
                <Button variant="primary" size='sm' onClick={handleProtectedAction}>Book Plot</Button>
                <Button variant="outline" size='sm' onClick={handleProtectedAction}>Enquire Now</Button>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="inline-block bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-semibold shadow">Area: {plot.area.toLocaleString()} sqft</span>
                <span className="inline-block bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-semibold shadow">Price: ₹{plot.price.toLocaleString()}/sqft</span>
              </div>
            </div>
            <div className="flex-1 flex justify-center">
              <PlotImageVideo imageUrl={plot.imageUrl} videoUrl={DEMO_VIDEO_URL} alt={plot.title} />
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-4">
            <Card title="Plot Overview" className="bg-white/90 shadow border-0 rounded-xl text-sm">
                <div className="flex flex-col md:flex-row gap-4">
                  <img src={plot.imageUrl} alt={plot.title} className="w-full md:w-1/2 h-40 object-cover rounded shadow-md" />
                  <div className="md:w-1/2">
                    <div className="font-bold text-base mb-1 text-green-700">{plot.title}</div>
                    <div className="text-xs text-gray-600 mb-1">{plot.location}</div>
                    <p className="text-xs text-gray-500 mb-1 h-16 overflow-auto">{plot.description}</p>
                    <div className="text-sm text-green-700 font-semibold mb-1">₹{plot.price.toLocaleString()} /sqft</div>
                    <div className="text-xs text-gray-400">Area: {plot.area.toLocaleString()} sqft</div>
                  </div>
                </div>
                <div className="mt-4">
                    {/* 4. PASS THE HANDLER TO THE CHILD COMPONENT */}
                    <PlotOverviewDocs plot={plot} onAuthAction={handleProtectedAction} />
                </div>
            </Card>
          </div>
          <div className="lg:col-span-1 flex flex-col gap-4">
            <Card title="Why Choose This Plot?" className="bg-green-50 border-0 shadow rounded-xl text-sm">
                <ul className="list-disc pl-4 text-green-700 space-y-1">
                  <li>Prime location with excellent connectivity</li>
                  <li>Ready for construction</li>
                  <li>Clear title and legal documentation</li>
                  <li>High potential for appreciation</li>
                </ul>
            </Card>
             {/* Land Document Verification Card */}
                        <Card title="Land Document Verification" className="border-0 shadow rounded-xl text-sm" style={{ backgroundColor: '#22c55e' }}>
              <div className="flex flex-col gap-2">
                <div className="font-semibold" >Verify the land document before you buy it</div>
                <div className="text-xs mb-2" >Get peace of mind by verifying the legal status of the land before making your investment.</div>
                <Button variant="primary" size="sm" className="w-fit px-4 py-1 rounded shadow text-white" style={{ backgroundColor: '#22c55e', border: 'none' }}>Pay ₹5000 for Verification</Button>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {showLoginPopup && (
         <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-xs w-full flex flex-col items-center">
              <svg className="w-16 h-16 text-green-500 mb-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 11c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v3h16v-3c0-2.66-5.33-4-8-4z" /></svg>
              <div className="text-xl font-bold text-green-700 mb-2 text-center">Authentication Required</div>
              <div className="text-gray-600 text-center mb-6">Please login or sign up to continue.</div>
              <button className="w-full py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition" onClick={() => setShowLoginPopup(false)}>
                Close
              </button>
            </div>
        </div>
      )}
    </div>
  );
};

export default DPlotBookingDetailsPage;