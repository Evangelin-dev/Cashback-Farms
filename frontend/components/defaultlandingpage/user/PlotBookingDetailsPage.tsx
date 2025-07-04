import React, { useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import Button from '../../../components/Button';
import Card from '../../../components/Card';
import InvestmentSummaryCard from '../../../components/InvestmentSummaryCard';
import PaymentScheduleTable from '../../../components/PaymentScheduleTable';
import PaymentSummaryCard from '../../../components/PaymentSummaryCard';
import SiteInfoCard from '../../../components/SiteInfoCard';
import { getExtendedBookingDetailsById, MOCK_BOOKINGS, MOCK_PLOTS } from '../../../constants';
import { Plot } from '../../../types';

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
        videoRef.current?.pause();
        videoRef.current && (videoRef.current.currentTime = 0);
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

const PlotOverviewDocs: React.FC<{ plot: Plot }> = ({ plot }) => (
  <div className="space-y-2">
    <div className="bg-green-50 rounded p-2 shadow flex items-center gap-2">
      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2a4 4 0 014-4h4a4 4 0 014 4v2M9 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
      <div>
        <div className="font-semibold text-green-700 text-xs">Legal Documents</div>
        <div className="text-xs text-gray-500">View and download plot registry, NOC.</div>
        <div className="flex gap-1 mt-1">
          <Button variant="outline" size="sm" onClick={() => setShowLoginPopup(true)}>View Registry</Button>
          <Button variant="outline" size="sm" onClick={() => setShowLoginPopup(true)}>Download NOC</Button>
        </div>
      </div>
    </div>
    <div className="bg-green-50 rounded p-2 shadow flex items-center gap-2">
      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v4a1 1 0 001 1h3m10 0h3a1 1 0 001-1V7m-1 4V7a1 1 0 00-1-1h-3m-10 0H4a1 1 0 00-1 1v4m0 0v6a1 1 0 001 1h3m10 0h3a1 1 0 001-1v-6m-1 6v-6m0 0V7m0 0h-3m-10 0H4" />
      </svg>
      <div>
        <div className="font-semibold text-green-700 text-xs">Site Plan & Layout</div>
        <div className="text-xs text-gray-500">Download site plan and layout.</div>
        <div className="flex gap-1 mt-1">
          <Button variant="outline" size="sm" onClick={() => setShowLoginPopup(true)}>View Site Plan</Button>
          <Button variant="outline" size="sm" onClick={() => setShowLoginPopup(true)}>Download Layout</Button>
        </div>
      </div>
    </div>
    <div className="bg-green-50 rounded p-2 shadow flex items-center gap-2">
      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3" />
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={2} />
      </svg>
      <div>
        <div className="font-semibold text-green-700 text-xs">Construction Guidelines</div>
        <div className="text-xs text-gray-500">Short doc on rules, setbacks, approvals.</div>
        <div className="flex gap-1 mt-1">
          <Button variant="outline" size="sm" onClick={() => setShowLoginPopup(true)}>View Guidelines</Button>
        </div>
      </div>
    </div>
  </div>
);

const DPlotBookingDetailsPage: React.FC = () => {
  const { bookingId: routeBookingId } = useParams<{ bookingId: string }>();
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  let bookingDetails = routeBookingId ? getExtendedBookingDetailsById(routeBookingId) : undefined;
  if (!bookingDetails && !routeBookingId) {
    for (const booking of MOCK_BOOKINGS) {
      const details = getExtendedBookingDetailsById(booking.id);
      if (details && details.plotInfo && details.user) {
        bookingDetails = details;
        break;
      }
    }
  }

  // If still not found, show the first plot as a generic detail card (no booking)
  if (!bookingDetails || !bookingDetails.plotInfo || !bookingDetails.user) {
    const plot = MOCK_PLOTS[0];
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 py-4 px-1">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="relative flex flex-col md:flex-row items-center gap-4 bg-gradient-to-r from-green-100 via-white to-green-200 rounded-2xl shadow-xl p-4 border border-green-200 overflow-hidden">
            <div className="flex-1">
              <h1 className="text-2xl font-extrabold text-green-800 mb-1 flex items-center gap-2">
                <span className="inline-block w-1 h-6 bg-green-400 rounded-full"></span>
                {plot.title}
              </h1>
              <p className="text-base text-green-600 font-semibold mb-1">Plot ID: {plot.id}</p>
              <p className="text-xs text-neutral-500 mb-2">No booking found for this plot.</p>
              <div className="flex items-center gap-2 mt-2">
                <Button
                  variant="primary"
                  size='sm'
                  className="px-3 py-1 text-sm rounded shadow"
                  onClick={() => setShowLoginPopup(true)}
                >
                  Book Plot (Mock)
                </Button>
                <Button
                  variant="outline"
                  size='sm'
                  className="px-3 py-1 text-sm rounded shadow ml-1"
                  onClick={() => setShowLoginPopup(true)}
                >
                  Book My SqFt (Mock)
                </Button>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="inline-block bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-semibold shadow">Area: {plot.area} sqft</span>
                <span className="inline-block bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-semibold shadow">Price: ₹{plot.price?.toLocaleString() || plot.sqftPrice + " /sqft"}</span>
                {plot.amenities && (
                  <span className="inline-block bg-green-50 text-green-600 px-2 py-0.5 rounded-full text-xs font-semibold shadow">
                    Amenities: {plot.amenities.join(', ')}
                  </span>
                )}
              </div>
            </div>
            <div className="flex-1 flex justify-center">
              <PlotImageVideo
                imageUrl={plot.imageUrl || 'https://picsum.photos/seed/defaultplot/600/400'}
                videoUrl={DEMO_VIDEO_URL}
                alt={`Plot ${plot.id}`}
              />
            </div>
            <div className="absolute top-0 right-0 opacity-10 pointer-events-none select-none">
              <svg width="100" height="100" fill="none" viewBox="0 0 200 200">
                <circle cx="100" cy="100" r="100" fill="#22c55e" />
              </svg>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 space-y-4">
              <Card title="Plot Overview" className="bg-white/90 shadow border-0 rounded-xl text-sm">
                <div className="flex flex-col md:flex-row gap-4">
                  <img
                    src={plot.imageUrl || 'https://picsum.photos/seed/defaultplot/600/400'}
                    alt={`Plot ${plot.id}`}
                    className="w-full md:w-1/2 h-40 object-cover rounded shadow-md border border-green-100"
                    onError={(e) => (e.currentTarget.src = 'https://picsum.photos/seed/errorplot/600/400')}
                  />
                  <div className="md:w-1/2 flex flex-col justify-between">
                    <div>
                      <div className="font-bold text-base mb-1 text-green-700">{plot.title}</div>
                      <div className="text-xs text-gray-600 mb-1">{plot.location}</div>
                      <div className="text-xs text-gray-500 mb-1">{plot.description}</div>
                      <div className="text-sm text-green-700 font-semibold mb-1">₹{plot.price?.toLocaleString() || plot.sqftPrice + " /sqft"}</div>
                      <div className="text-xs text-gray-400">Area: {plot.area} sqft</div>
                      {plot.amenities && (
                        <div className="text-xs text-gray-400 mt-1">
                          <span className="font-semibold text-green-600">Amenities:</span> {plot.amenities.join(', ')}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <PlotOverviewDocs plot={plot} />
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
            </div>
          </div>
        </div>
        {/* Popup for login/sign up */}
        {showLoginPopup && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-xs w-full flex flex-col items-center animate-fade-in">
              <svg className="w-16 h-16 text-green-500 mb-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 11c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v3h16v-3c0-2.66-5.33-4-8-4z" />
              </svg>
              <div className="text-xl font-bold text-green-700 mb-2 text-center">Please Login / Sign Up</div>
              <div className="text-gray-600 text-center mb-6">You need to be logged in to continue to checkout.</div>
              <button
                className="w-full py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition"
                onClick={() => setShowLoginPopup(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Show booking details and plot details
  const plot: Plot = bookingDetails.plotInfo;
  const { investmentDetails, payments, paymentSummary, siteDetails, user, id } = bookingDetails;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 py-4 px-1">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="relative flex flex-col md:flex-row items-center gap-4 bg-gradient-to-r from-green-100 via-white to-green-200 rounded-2xl shadow-xl p-4 border border-green-200 overflow-hidden">
          <div className="flex-1">
            <h1 className="text-2xl font-extrabold text-green-800 mb-1 flex items-center gap-2">
              <span className="inline-block w-1 h-6 bg-green-400 rounded-full"></span>
              {plot.title}
            </h1>
            <p className="text-base text-green-600 font-semibold mb-1">
              Plot ID: {plot.id} <span className="text-gray-400">(Booking ID: {id})</span>
            </p>
            <p className="text-xs text-neutral-500 mb-2">Booked by: <span className="font-semibold text-green-700">{user.name}</span></p>
            <div className="flex items-center gap-2 mt-2">
              <Button
                variant="primary"
                className="px-3 py-1 text-sm rounded shadow"
                onClick={() => setShowLoginPopup(true)}
              >
                Book Consultation (Mock)
              </Button>
              <Button
                variant="outline"
                className="px-3 py-1 text-sm rounded shadow ml-1"
                onClick={() => setShowLoginPopup(true)}
              >
                Request Callback (Mock)
              </Button>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="inline-block bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-semibold shadow">Area: {plot.area} sqft</span>
              <span className="inline-block bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-semibold shadow">Price: ₹{plot.price?.toLocaleString() || plot.sqftPrice + " /sqft"}</span>
              {plot.amenities && (
                <span className="inline-block bg-green-50 text-green-600 px-2 py-0.5 rounded-full text-xs font-semibold shadow">
                  Amenities: {plot.amenities.join(', ')}
                </span>
              )}
            </div>
          </div>
          <div className="flex-1 flex justify-center">
            <PlotImageVideo
              imageUrl={plot.imageUrl || 'https://picsum.photos/seed/defaultplot/600/400'}
              videoUrl={DEMO_VIDEO_URL}
              alt={`Plot ${plot.id}`}
            />
          </div>
          <div className="absolute top-0 right-0 opacity-10 pointer-events-none select-none">
            <svg width="100" height="100" fill="none" viewBox="0 0 200 200">
              <circle cx="100" cy="100" r="100" fill="#22c55e" />
            </svg>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-4">
            <Card title="Plot Overview" className="bg-white/90 shadow border-0 rounded-xl text-sm">
              <div className="flex flex-col md:flex-row gap-4">
                <img
                  src={plot.imageUrl || 'https://picsum.photos/seed/defaultplot/600/400'}
                  alt={`Plot ${plot.id}`}
                  className="w-full md:w-1/2 h-40 object-cover rounded shadow-md border border-green-100"
                  onError={(e) => (e.currentTarget.src = 'https://picsum.photos/seed/errorplot/600/400')}
                />
                <div className="md:w-1/2 flex flex-col justify-between">
                  <div>
                    <div className="font-bold text-base mb-1 text-green-700">{plot.title}</div>
                    <div className="text-xs text-gray-600 mb-1">{plot.location}</div>
                    <div className="text-xs text-gray-500 mb-1">{plot.description}</div>
                    <div className="text-sm text-green-700 font-semibold mb-1">₹{plot.price?.toLocaleString() || plot.sqftPrice + " /sqft"}</div>
                    <div className="text-xs text-gray-400">Area: {plot.area} sqft</div>
                    {plot.amenities && (
                      <div className="text-xs text-gray-400 mt-1">
                        <span className="font-semibold text-green-600">Amenities:</span> {plot.amenities.join(', ')}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <PlotOverviewDocs plot={plot} />
              </div>
            </Card>
            {investmentDetails && <InvestmentSummaryCard investmentDetails={investmentDetails} />}
          </div>
          <div className="lg:col-span-1 flex flex-col gap-4">
            <PaymentSummaryCard summary={paymentSummary} />
            <Card title="Why Choose This Plot?" className="bg-green-50 border-0 shadow rounded-xl text-sm">
              <ul className="list-disc pl-4 text-green-700 space-y-1">
                <li>Prime location with excellent connectivity</li>
                <li>Ready for construction</li>
                <li>Clear title and legal documentation</li>
                <li>Flexible payment options</li>
                <li>Gated community with amenities</li>
              </ul>
            </Card>
          </div>
        </div>
        <div className="mt-6">
          <PaymentScheduleTable installments={payments} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <SiteInfoCard siteDetails={siteDetails} />
          {/* <MaterialsInfoCard materials={materials} /> */}
        </div>
      </div>
      {/* Popup for login/sign up */}
      {showLoginPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-xs w-full flex flex-col items-center animate-fade-in">
            <svg className="w-16 h-16 text-green-500 mb-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 11c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v3h16v-3c0-2.66-5.33-4-8-4z" />
            </svg>
            <div className="text-xl font-bold text-green-700 mb-2 text-center">Please Login / Sign Up</div>
            <div className="text-gray-600 text-center mb-6">You need to be logged in to continue to checkout.</div>
            <button
              className="w-full py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition"
              onClick={() => setShowLoginPopup(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DPlotBookingDetailsPage;


function setShowLoginPopup(arg0: boolean): void {
  throw new Error('Function not implemented.');
}

