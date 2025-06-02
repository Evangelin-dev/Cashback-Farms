
import React from 'react';
import { useParams } from 'react-router-dom';
import { getExtendedBookingDetailsById, MOCK_USERS } from '../constants'; // MOCK_USERS for potential display
import Card from '../components/Card';
import Button from '../components/Button';
import PlotDetailsCard from '../components/PlotDetailsCard';
import InvestmentSummaryCard from '../components/InvestmentSummaryCard';
import PaymentScheduleTable from '../components/PaymentScheduleTable';
import PaymentSummaryCard from '../components/PaymentSummaryCard';
import SiteInfoCard from '../components/SiteInfoCard';
import MaterialsInfoCard from '../components/MaterialsInfoCard';
// Removed BookingDetails type import as we use the return type of getExtendedBookingDetailsById

const PlotBookingDetailsPage: React.FC = () => {
  const { bookingId: routeBookingId } = useParams<{ bookingId: string }>();
  const bookingId = routeBookingId || 'B001'; // Default to B001 if no ID in URL (e.g. for "/")

  const bookingDetails = getExtendedBookingDetailsById(bookingId);

  if (!bookingDetails || !bookingDetails.plotInfo || !bookingDetails.user) {
    return <div className="text-center p-10 text-red-500">Error: Booking details not found for ID: {bookingId}. Please check the booking ID or constants.</div>;
  }

  // Destructure properties directly from bookingDetails.
  // The 'id' here is the booking ID. Other properties like 'status', 'bookingDate'
  // are also directly available on bookingDetails if needed.
  const { plotInfo, investmentDetails, payments, paymentSummary, siteDetails, materials, user, id } = bookingDetails;

  return (
    <div className="space-y-6 lg:space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-neutral-800">
            {plotInfo.projectName} - <span className="text-primary">{plotInfo.phase}</span>
          </h1>
          {/* Use the directly destructured 'id' as Booking ID */}
          <p className="text-neutral-500">Plot No: {plotInfo.plotNo} (Booking ID: {id})</p>
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
                src={plotInfo.plotImageUrl || 'https://picsum.photos/seed/defaultplot/600/400'} 
                alt={`Plot ${plotInfo.plotNo}`} 
                className="w-full md:w-1/2 h-64 object-cover rounded-lg shadow-md"
                onError={(e) => (e.currentTarget.src = 'https://picsum.photos/seed/errorplot/600/400')}
              />
              <div className="md:w-1/2">
                <PlotDetailsCard plotInfo={plotInfo} />
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
        <MaterialsInfoCard materials={materials} />
      </div>
    </div>
  );
};

export default PlotBookingDetailsPage;
