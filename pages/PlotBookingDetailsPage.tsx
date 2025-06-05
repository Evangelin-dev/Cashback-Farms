import React from 'react';
import { useParams } from 'react-router-dom';
import Button from '../components/Button';
import Card from '../components/Card';
import InvestmentSummaryCard from '../components/InvestmentSummaryCard';
import MaterialsInfoCard from '../components/MaterialsInfoCard';
import PaymentScheduleTable from '../components/PaymentScheduleTable';
import PaymentSummaryCard from '../components/PaymentSummaryCard';
import SiteInfoCard from '../components/SiteInfoCard';
import { getExtendedBookingDetailsById, MOCK_BOOKINGS, MOCK_PLOTS } from '../constants';
import { Plot } from '../types';

const PlotBookingDetailsPage: React.FC = () => {
  const { bookingId: routeBookingId } = useParams<{ bookingId: string }>();

  // Try to get booking details by bookingId
  let bookingDetails = routeBookingId ? getExtendedBookingDetailsById(routeBookingId) : undefined;

  // If not found, try to find a booking for the first plot
  if (!bookingDetails && !routeBookingId) {
    // Use the first booking in MOCK_BOOKINGS that has a valid plotInfo and user
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
      <div className="space-y-6 lg:space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-neutral-800">
              {plot.title} - <span className="text-primary">{plot.id}</span>
            </h1>
            <p className="text-neutral-500">Plot ID: {plot.id}</p>
            <p className="text-sm text-neutral-500">No booking found for this plot.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-2 space-y-6 lg:space-y-8">
            <Card title="Plot Overview">
              <div className="flex flex-col md:flex-row gap-6">
                <img 
                  src={plot.imageUrl || 'https://picsum.photos/seed/defaultplot/600/400'} 
                  alt={`Plot ${plot.id}`} 
                  className="w-full md:w-1/2 h-64 object-cover rounded-lg shadow-md"
                  onError={(e) => (e.currentTarget.src = 'https://picsum.photos/seed/errorplot/600/400')}
                />
                <div className="md:w-1/2">
                  <div>
                    <div className="font-semibold mb-2">{plot.title}</div>
                    <div className="text-sm text-gray-600 mb-1">{plot.location}</div>
                    <div className="text-xs text-gray-500 mb-1">{plot.description}</div>
                    <div className="text-sm text-green-700 font-semibold mb-1">₹{plot.price?.toLocaleString() || plot.sqftPrice + " /sqft"}</div>
                    <div className="text-xs text-gray-400">Area: {plot.area} sqft</div>
                    {plot.amenities && (
                      <div className="text-xs text-gray-400 mt-2">
                        Amenities: {plot.amenities.join(', ')}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Show booking details and plot details
  const plot: Plot = bookingDetails.plotInfo;
  const { investmentDetails, payments, paymentSummary, siteDetails, materials, user, id } = bookingDetails;

  return (
    <div className="space-y-6 lg:space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-neutral-800">
            {plot.title} - <span className="text-primary">{plot.id}</span>
          </h1>
          <p className="text-neutral-500">Plot ID: {plot.id} (Booking ID: {id})</p>
          <p className="text-sm text-neutral-500">Booked by: {user.name}</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="primary" onClick={() => alert('Pay Now functionality to be implemented.')}>Pay Now</Button>
          <Button variant="outline" onClick={() => alert('Download Allotment Letter functionality to be implemented.')}>Download Allotment Letter</Button>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="lg:col-span-2 space-y-6 lg:space-y-8">
          <Card title="Plot Overview">
            <div className="flex flex-col md:flex-row gap-6">
              <img 
                src={plot.imageUrl || 'https://picsum.photos/seed/defaultplot/600/400'} 
                alt={`Plot ${plot.id}`} 
                className="w-full md:w-1/2 h-64 object-cover rounded-lg shadow-md"
                onError={(e) => (e.currentTarget.src = 'https://picsum.photos/seed/errorplot/600/400')}
              />
              <div className="md:w-1/2">
                <div>
                  <div className="font-semibold mb-2">{plot.title}</div>
                  <div className="text-sm text-gray-600 mb-1">{plot.location}</div>
                  <div className="text-xs text-gray-500 mb-1">{plot.description}</div>
                  <div className="text-sm text-green-700 font-semibold mb-1">₹{plot.price?.toLocaleString() || plot.sqftPrice + " /sqft"}</div>
                  <div className="text-xs text-gray-400">Area: {plot.area} sqft</div>
                  {plot.amenities && (
                    <div className="text-xs text-gray-400 mt-2">
                      Amenities: {plot.amenities.join(', ')}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>
          {investmentDetails && <InvestmentSummaryCard investmentDetails={investmentDetails} />}
        </div>
        <div className="lg:col-span-1 space-y-6 lg:space-y-8">
          <PaymentSummaryCard summary={paymentSummary} />
        </div>
      </div>
      <PaymentScheduleTable installments={payments} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        <SiteInfoCard siteDetails={siteDetails} />
        {/* <MaterialsInfoCard materials={materials} /> */}
        
      </div>
    </div>
  );
};

export default PlotBookingDetailsPage;
