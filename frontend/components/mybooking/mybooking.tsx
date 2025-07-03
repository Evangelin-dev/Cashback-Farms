import React, { useEffect, useState } from 'react';
import apiClient from '@/src/utils/api/apiClient';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

// --- TYPE DEFINITIONS ---
type Status = 'Confirmed' | 'Pending' | 'Cancelled';

interface ApiBooking {
  id: number;
  plot_listing: number;
  plot_title: string;
  client: number;
  client_username:string;
  booking_type: string;
  booked_area_sqft: string;
  total_price: string;
  booking_date: string;
  status: Status;
}

const MyBooking: React.FC = () => {
  const [bookings, setBookings] = useState<ApiBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [selectedBooking, setSelectedBooking] = useState<ApiBooking | null>(null);
  const [showReceiptPopup, setShowReceiptPopup] = useState(false);

  useEffect(() => {
    const fetchBookings = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const accessToken = localStorage.getItem("access_token");
        if (!accessToken) throw new Error("Access token not found. Please log in.");
        
        const response = await apiClient.get<ApiBooking[]>('/my/bookings/', {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        const sortedBookings = (response || []).sort((a: ApiBooking, b: ApiBooking) => new Date(b.booking_date).getTime() - new Date(a.booking_date).getTime());
        setBookings(sortedBookings);
      } catch (err: any) {
        setError("Failed to fetch your bookings. Please try again later.");
        console.error("Fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const handleViewDetails = (booking: ApiBooking) => {
    setSelectedBooking(booking);
  };

  const handleCloseDetails = () => {
    setSelectedBooking(null);
  };

  const handleDownloadReceipt = (booking: ApiBooking) => {
    setSelectedBooking(booking);
    setShowReceiptPopup(true);
  };

  // --- COMPLETELY REWRITTEN PDF GENERATION ---
  const handleGeneratePdf = (booking: ApiBooking) => {
    const doc = new jsPDF();

    // 1. Header
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(24);
    doc.text('Booking Receipt', doc.internal.pageSize.getWidth() / 2, 20, { align: 'center' });
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.text(`Booking ID: BKG${booking.id}`, 14, 35);
    doc.text(`Date: ${new Date(booking.booking_date).toLocaleDateString()}`, doc.internal.pageSize.getWidth() - 14, 35, { align: 'right' });

    // 2. Main Details Table
    const tableData = [
      { label: 'Property Name', value: booking.plot_title },
      { label: 'Client', value: booking.client_username },
      { label: 'Booking Type', value: `${booking.booking_type} Booking` },
      { label: 'Area Booked', value: `${booking.booked_area_sqft} sq.ft` },
    ];
    
    (doc as any).autoTable({
      startY: 45,
      body: tableData,
      columns: [ { header: 'Description', dataKey: 'label' }, { header: 'Details', dataKey: 'value' } ],
      theme: 'striped',
      headStyles: { fillColor: [22, 160, 133] },
      didDrawPage: (data: any) => {
        // This function runs after the table is drawn
        let finalY = data.cursor.y; // Get the Y position after the table
    
        // 3. Status and Total Section
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');

        // Status
        let statusColor: [number, number, number] = [128, 128, 128]; // Gray for default
        if (booking.status === 'Confirmed') statusColor = [39, 174, 96]; // Green
        if (booking.status === 'Cancelled') statusColor = [192, 57, 43]; // Red
        if (booking.status === 'Pending') statusColor = [241, 196, 15]; // Yellow
        
        doc.setTextColor(...statusColor);
        doc.text('Status:', 14, finalY + 15);
        doc.text(booking.status.toUpperCase(), 35, finalY + 15);
        
        // Total Price
        doc.setTextColor(0, 0, 0); // Reset to black
        const totalPrice = `₹ ${parseFloat(booking.total_price).toLocaleString('en-IN')}`;
        doc.text('Total Price:', doc.internal.pageSize.getWidth() - 14, finalY + 15, { align: 'right' });
        doc.text(totalPrice, doc.internal.pageSize.getWidth() - 40, finalY + 15, { align: 'right' });
        
        // 4. Footer
        doc.setFontSize(10);
        doc.setTextColor(150);
        const pageHeight = doc.internal.pageSize.getHeight();
        doc.text('Thank you for choosing Cashback Farms.', doc.internal.pageSize.getWidth() / 2, pageHeight - 10, { align: 'center' });
      }
    });

    doc.save(`Receipt-Booking-BKG${booking.id}.pdf`);
  };

  const handleConfirmDownload = () => {
    if (selectedBooking) {
      handleGeneratePdf(selectedBooking);
    }
    setShowReceiptPopup(false);
  };

  const handleCancelDownload = () => {
    setShowReceiptPopup(false);
  };

  const getStatusClass = (status: Status) => {
    switch(status) {
      case 'Confirmed': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return <div className="text-center py-10">Loading your bookings...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-600 bg-red-50 p-4 rounded-lg">{error}</div>;
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-green-50 to-white py-10 px-4 flex flex-col items-center">
      <div className="w-full max-w-5xl">
        <h1 className="text-3xl font-extrabold text-green-700 mb-8 text-center tracking-tight drop-shadow">My Bookings & Properties</h1>
        
        {bookings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {bookings.map((booking) => (
              <div key={booking.id} className="relative bg-white rounded-3xl shadow-xl border border-green-100 hover:shadow-2xl transition-shadow flex flex-col overflow-hidden group">
                <div className="relative h-48 w-full overflow-hidden">
                  <img src={`https://source.unsplash.com/random/400x300/?land,valley,${booking.id}`} alt={booking.plot_title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className={`absolute top-4 left-4 text-xs px-3 py-1 rounded-full shadow font-semibold ${getStatusClass(booking.status)}`}>{booking.status}</div>
                </div>
                <div className="flex-1 p-6 flex flex-col justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-green-800 mb-1">{booking.plot_title}</h2>
                    <div className="flex items-center gap-2 mb-2"><span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Booking ID: BKG{booking.id}</span></div>
                    <div className="text-gray-600 text-sm mb-2"><span className="font-medium">Booking Date:</span> {new Date(booking.booking_date).toLocaleDateString()}</div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button className="flex-1 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition shadow" onClick={() => handleViewDetails(booking)}>View Details</button>
                    <button className="flex-1 py-2 bg-green-50 text-green-700 rounded-lg font-semibold hover:bg-green-100 transition border border-green-200 shadow" onClick={() => handleDownloadReceipt(booking)}>Download Receipt</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 mt-16"><img src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png" alt="No bookings" className="mx-auto w-32 mb-4 opacity-60" /><p className="text-lg font-medium">No bookings found yet.</p><p className="text-sm mt-2">Start exploring properties and make your first booking!</p></div>
        )}
      </div>

      {selectedBooking && !showReceiptPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 relative animate-fadeIn flex flex-col items-center border-2 border-green-200">
            <button className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-2xl" onClick={handleCloseDetails}>×</button>
            <img src={`https://source.unsplash.com/random/800x600/?land,valley,${selectedBooking.id}`} alt={selectedBooking.plot_title} className="w-64 h-40 object-cover rounded-xl shadow mb-4 border border-green-100" />
            <h2 className="text-2xl font-bold text-green-700 mb-2">{selectedBooking.plot_title}</h2>
            <div className="text-gray-600 mb-1"><span className="font-semibold">Booking ID:</span> BKG{selectedBooking.id}</div>
            <div className="text-gray-600 mb-1"><span className="font-semibold">Booking Date:</span> {new Date(selectedBooking.booking_date).toLocaleDateString()}</div>
            <div className="text-gray-600 mb-2"><span className="font-semibold">Status:</span>{' '}<span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getStatusClass(selectedBooking.status)}`}>{selectedBooking.status}</span></div>
            <div className="w-full mt-4 bg-green-50 rounded-lg p-4 text-sm text-green-900 shadow-inner">
              <div><span className="font-semibold">Land Area:</span> {selectedBooking.booked_area_sqft} sq.ft</div>
            </div>
            <button className="mt-6 px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition" onClick={handleCloseDetails}>Close</button>
          </div>
        </div>
      )}

      {showReceiptPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-8 relative animate-fadeIn flex flex-col items-center border-2 border-green-200">
            <button className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-2xl" onClick={handleCancelDownload}>×</button>
            <h2 className="text-xl font-bold text-green-700 mb-2">Download Receipt</h2>
            <p className="text-gray-700 mb-4 text-center">Download the receipt for <span className="font-semibold">{selectedBooking?.plot_title}</span>?</p>
            <div className="flex gap-4 w-full mt-2">
              <button className="flex-1 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition" onClick={handleConfirmDownload}>Okay</button>
              <button className="flex-1 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition" onClick={handleCancelDownload}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBooking;