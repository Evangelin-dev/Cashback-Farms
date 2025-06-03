import React, { useState } from 'react';

const bookings = [
  {
    id: 'BKG12345',
    property: 'Green Valley Plot #12',
    location: 'Bangalore, Karnataka',
    date: '2024-06-01',
    status: 'Confirmed',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'BKG12346',
    property: 'Sunshine Meadows Plot #7',
    location: 'Hyderabad, Telangana',
    date: '2024-05-15',
    status: 'Pending',
    image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80',
  },
];

const MyBooking: React.FC = () => {
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);
  const [showReceiptPopup, setShowReceiptPopup] = useState(false);

  const handleViewDetails = (booking: any) => {
    setSelectedBooking(booking);
  };

  const handleCloseDetails = () => {
    setSelectedBooking(null);
  };

  const handleDownloadReceipt = (booking: any) => {
    setSelectedBooking(booking);
    setShowReceiptPopup(true);
  };

  const handleConfirmDownload = () => {
    setShowReceiptPopup(false);
    // Simulate download (replace with real download logic)
    setTimeout(() => {
      alert('Receipt downloaded!');
    }, 500);
  };

  const handleCancelDownload = () => {
    setShowReceiptPopup(false);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-green-50 to-white py-10 px-4 flex flex-col items-center">
      <div className="w-full max-w-5xl">
        <h1 className="text-3xl font-extrabold text-green-700 mb-8 text-center tracking-tight drop-shadow">
          My Bookings & Properties
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="relative bg-white rounded-3xl shadow-xl border border-green-100 hover:shadow-2xl transition-shadow flex flex-col overflow-hidden group"
            >
              <div className="relative h-48 w-full overflow-hidden">
                <img
                  src={booking.image}
                  alt={booking.property}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  style={{ borderTopLeftRadius: '1.5rem', borderTopRightRadius: '1.5rem' }}
                />
                <div className="absolute top-4 left-4 bg-green-600 text-white text-xs px-3 py-1 rounded-full shadow font-semibold">
                  {booking.status}
                </div>
              </div>
              <div className="flex-1 p-6 flex flex-col justify-between">
                <div>
                  <h2 className="text-xl font-bold text-green-800 mb-1">{booking.property}</h2>
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 12.414a2 2 0 00-2.828 0l-4.243 4.243A8 8 0 1116.657 7.343z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-gray-500 text-sm">{booking.location}</span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                      Booking ID: {booking.id}
                    </span>
                  </div>
                  <div className="text-gray-600 text-sm mb-2">
                    <span className="font-medium">Booking Date:</span> {booking.date}
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <button
                    className="flex-1 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition shadow"
                    onClick={() => handleViewDetails(booking)}
                  >
                    View Details
                  </button>
                  <button
                    className="flex-1 py-2 bg-green-50 text-green-700 rounded-lg font-semibold hover:bg-green-100 transition border border-green-200 shadow"
                    onClick={() => handleDownloadReceipt(booking)}
                  >
                    Download Receipt
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {bookings.length === 0 && (
          <div className="text-center text-gray-500 mt-16">
            <img
              src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png"
              alt="No bookings"
              className="mx-auto w-32 mb-4 opacity-60"
            />
            <p className="text-lg font-medium">No bookings found yet.</p>
            <p className="text-sm mt-2">Start exploring properties and make your first booking!</p>
          </div>
        )}
      </div>

      {/* View Details Popup */}
      {selectedBooking && !showReceiptPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 relative animate-fadeIn flex flex-col items-center border-2 border-green-200">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-2xl"
              onClick={handleCloseDetails}
              aria-label="Close"
            >
              &times;
            </button>
            <img
              src={selectedBooking.image}
              alt={selectedBooking.property}
              className="w-64 h-40 object-cover rounded-xl shadow mb-4 border border-green-100"
            />
            <h2 className="text-2xl font-bold text-green-700 mb-2">{selectedBooking.property}</h2>
            <div className="text-gray-600 mb-1">
              <span className="font-semibold">Location:</span> {selectedBooking.location}
            </div>
            <div className="text-gray-600 mb-1">
              <span className="font-semibold">Booking ID:</span> {selectedBooking.id}
            </div>
            <div className="text-gray-600 mb-1">
              <span className="font-semibold">Booking Date:</span> {selectedBooking.date}
            </div>
            <div className="text-gray-600 mb-1">
              <span className="font-semibold">Status:</span>{' '}
              <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${selectedBooking.status === 'Confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                {selectedBooking.status}
              </span>
            </div>
            {/* Creative Land Details */}
            <div className="w-full mt-4 bg-green-50 rounded-lg p-4 text-sm text-green-900 shadow-inner">
              <div><span className="font-semibold">Land Area:</span> 2400 sq.ft</div>
              <div><span className="font-semibold">Facing:</span> East</div>
              <div><span className="font-semibold">Amenities:</span> Water, Electricity, Road, Park</div>
              <div><span className="font-semibold">Owner:</span> Green Valley Estates</div>
              <div><span className="font-semibold">Registration:</span> Ready for registration</div>
            </div>
            <button
              className="mt-6 px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
              onClick={handleCloseDetails}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Download Receipt Confirmation Popup */}
      {showReceiptPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-8 relative animate-fadeIn flex flex-col items-center border-2 border-green-200">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-2xl"
              onClick={handleCancelDownload}
              aria-label="Close"
            >
              &times;
            </button>
            <img
              src="https://cdn-icons-png.flaticon.com/512/1828/1828919.png"
              alt="Download"
              className="w-16 h-16 mb-4"
            />
            <h2 className="text-xl font-bold text-green-700 mb-2">Download Receipt</h2>
            <p className="text-gray-700 mb-4 text-center">
              Are you sure you want to download the receipt for <span className="font-semibold">{selectedBooking?.property}</span>?
            </p>
            <div className="flex gap-4 w-full mt-2">
              <button
                className="flex-1 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
                onClick={handleConfirmDownload}
              >
                Okay
              </button>
              <button
                className="flex-1 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition"
                onClick={handleCancelDownload}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBooking;
