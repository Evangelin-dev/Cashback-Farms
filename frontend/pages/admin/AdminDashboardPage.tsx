
import React, { useState, useEffect, useMemo } from 'react';
import Card from '../../components/Card';
import { MOCK_PLOTS, MOCK_USERS, MOCK_BOOKINGS, MOCK_PAYMENTS } from '../../constants';
import { Booking, PaymentInstallment, PaymentStatus, PlotInfo, User } from '../../types';

interface MonthlyBookingData {
  monthYear: string; // e.g., "Jan 2024"
  count: number;
}

// Moved monthNameToNumber function definition here
const monthNameToNumber = (monthName: string) => {
  return new Date(Date.parse(monthName +" 1, 2012")).getMonth()+1;
}

const AdminDashboardPage: React.FC = () => {
  const [bookingTimeFilter, setBookingTimeFilter] = useState<string>('all'); // '3months', '6months', 'all'

  // KPI Calculations
  const totalPlots = useMemo(() => MOCK_PLOTS.length, [MOCK_PLOTS]);
  const bookedPlots = useMemo(() => MOCK_PLOTS.filter(p => !p.isAvailable).length, [MOCK_PLOTS]);
  const availablePlots = useMemo(() => totalPlots - bookedPlots, [totalPlots, bookedPlots]);
  const totalUsers = useMemo(() => MOCK_USERS.length, [MOCK_USERS]);
  const totalRevenue = useMemo(() => 
    MOCK_PAYMENTS.filter(p => p.status === PaymentStatus.PAID).reduce((sum, p) => sum + p.amount, 0),
    [MOCK_PAYMENTS]
  );

  // Bookings Trend Data
  const monthlyBookingsData = useMemo((): MonthlyBookingData[] => {
    const now = new Date();
    let startDate = new Date(0); // Default for 'all'

    if (bookingTimeFilter === '3months') {
      startDate = new Date(now.getFullYear(), now.getMonth() - 2, 1); // Start of 3 months ago
    } else if (bookingTimeFilter === '6months') {
      startDate = new Date(now.getFullYear(), now.getMonth() - 5, 1); // Start of 6 months ago
    }

    const filteredBookings = MOCK_BOOKINGS.filter(booking => {
      const bookingDate = new Date(booking.bookingDate);
      return bookingDate >= startDate;
    });

    const aggregation: { [key: string]: number } = {};

    filteredBookings.forEach(booking => {
      const bookingDate = new Date(booking.bookingDate);
      const monthYear = bookingDate.toLocaleString('default', { month: 'short' }) + ' ' + bookingDate.getFullYear();
      if (!aggregation[monthYear]) {
        aggregation[monthYear] = 0;
      }
      aggregation[monthYear]++;
    });
    
    // Sort by date for correct chart order
    const sortedData = Object.entries(aggregation)
      .map(([monthYear, count]) => ({ monthYear, count, date: new Date(monthYear.split(' ')[1] + '-' + monthNameToNumber(monthYear.split(' ')[0]) + '-01') }))
      .sort((a,b) => a.date.getTime() - b.date.getTime())
      .map(({monthYear, count}) => ({monthYear, count}));

    return sortedData;
  }, [MOCK_BOOKINGS, bookingTimeFilter]);

  const maxBookingCount = useMemo(() => 
    monthlyBookingsData.reduce((max, item) => Math.max(max, item.count), 0)
  , [monthlyBookingsData]);


  const kpiCardData = [
    { title: "Total Plots", value: totalPlots.toLocaleString(), color: "bg-blue-500" },
    { title: "Booked Plots", value: bookedPlots.toLocaleString(), color: "bg-red-500" },
    { title: "Available Plots", value: availablePlots.toLocaleString(), color: "bg-green-500" },
    { title: "Registered Users", value: totalUsers.toLocaleString(), color: "bg-yellow-500" },
    { title: "Total Revenue (Paid)", value: `₹${totalRevenue.toLocaleString()}`, color: "bg-purple-500" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold text-neutral-800">Admin Dashboard</h1>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {kpiCardData.map(kpi => (
          <Card key={kpi.title} className={`${kpi.color} text-white shadow-lg`} bodyClassName="p-4">
            <h3 className="text-sm font-medium uppercase tracking-wider opacity-80">{kpi.title}</h3>
            <p className="text-3xl font-bold mt-1">{kpi.value}</p>
          </Card>
        ))}
      </div>

      {/* Bookings Trend Chart */}
      <Card>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 px-6 pt-4">
          <h2 className="text-xl font-semibold text-neutral-700">Bookings Trend</h2>
          <div>
            <label htmlFor="bookingTimeFilter" className="text-sm text-neutral-600 mr-2">Period:</label>
            <select 
              id="bookingTimeFilter" 
              value={bookingTimeFilter} 
              onChange={(e) => setBookingTimeFilter(e.target.value)}
              className="p-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary text-sm"
            >
              <option value="all">All Time</option>
              <option value="3months">Last 3 Months</option>
              <option value="6months">Last 6 Months</option>
            </select>
          </div>
        </div>
        
        {monthlyBookingsData.length > 0 ? (
          <div className="px-6 pb-6">
            <div className="flex items-end space-x-2 sm:space-x-4 h-64 border-l border-b border-neutral-300 p-2 overflow-x-auto">
              {monthlyBookingsData.map(data => (
                <div key={data.monthYear} className="flex flex-col items-center flex-shrink-0 w-16 sm:w-20">
                  <div 
                    className="w-10 sm:w-12 bg-primary hover:bg-primary-dark transition-all duration-200" 
                    style={{ height: `${maxBookingCount > 0 ? (data.count / maxBookingCount) * 100 : 0}%` }}
                    title={`${data.monthYear}: ${data.count} bookings`}
                  >
                     <div className="text-center text-xs text-white pt-1 opacity-0 hover:opacity-100 transition-opacity">
                        {data.count}
                      </div>
                  </div>
                  <p className="text-xs text-neutral-600 mt-1 text-center">{data.monthYear}</p>
                </div>
              ))}
            </div>
             <p className="text-xs text-neutral-500 mt-2 text-center">Number of bookings per month.</p>
          </div>
        ) : (
          <div className="text-center py-10 px-6">
            <p className="text-neutral-500">No booking data available for the selected period.</p>
          </div>
        )}
      </Card>

      {/* Placeholder for more charts/widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Property Status Overview (Example)">
           <p className="text-neutral-600">Available: {availablePlots}</p>
           <p className="text-neutral-600">Booked: {bookedPlots}</p>
           {/* This could be a pie chart or more detailed bar chart later */}
        </Card>
        <Card title="Recent Activity (Placeholder)">
            <p className="text-neutral-500">Coming soon: Recent bookings, payments, user sign-ups...</p>
        </Card>
      </div>

    </div>
  );
};

export default AdminDashboardPage;