
import React, { useMemo, useState } from 'react';
import Card from '../../components/Card';
import { MOCK_BOOKINGS, MOCK_PAYMENTS, MOCK_PLOTS, MOCK_USERS } from '../../constants';
import { PaymentStatus } from '../../types';

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


  // Add icons for visual enhancement
  const kpiCardData = [
    { title: "Total Plots", value: totalPlots.toLocaleString(), color: "bg-gradient-to-r from-blue-500 to-blue-400", icon: <span className="inline-block mr-2"><svg width="24" height="24" fill="currentColor" className="text-white opacity-80"><rect x="4" y="8" width="16" height="8" rx="2"/></svg></span> },
    { title: "Booked Plots", value: bookedPlots.toLocaleString(), color: "bg-gradient-to-r from-red-500 to-red-400", icon: <span className="inline-block mr-2"><svg width="24" height="24" fill="currentColor" className="text-white opacity-80"><circle cx="12" cy="12" r="8"/></svg></span> },
    { title: "Available Plots", value: availablePlots.toLocaleString(), color: "bg-gradient-to-r from-green-500 to-green-400", icon: <span className="inline-block mr-2"><svg width="24" height="24" fill="currentColor" className="text-white opacity-80"><rect x="6" y="6" width="12" height="12" rx="3"/></svg></span> },
    { title: "Registered Users", value: totalUsers.toLocaleString(), color: "bg-gradient-to-r from-yellow-500 to-yellow-400", icon: <span className="inline-block mr-2"><svg width="24" height="24" fill="currentColor" className="text-white opacity-80"><circle cx="12" cy="10" r="4"/><rect x="8" y="16" width="8" height="4" rx="2"/></svg></span> },
    { title: "Total Revenue (Paid)", value: `₹${totalRevenue.toLocaleString()}`, color: "bg-gradient-to-r from-purple-500 to-purple-400", icon: <span className="inline-block mr-2"><svg width="24" height="24" fill="currentColor" className="text-white opacity-80"><path d="M6 12h12M12 6v12" stroke="white" strokeWidth="2"/></svg></span> },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold text-neutral-800 mb-2">Admin Dashboard</h1>
      {/* KPI Cards */}
      <div className="w-full overflow-x-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4 min-w-[340px] sm:min-w-0">
          {kpiCardData.map(kpi => (
            <Card key={kpi.title} className={`${kpi.color} text-white shadow-lg hover:scale-[1.03] hover:shadow-xl transition-all duration-200 dark:bg-neutral-800 dark:text-white`} bodyClassName="p-4 flex flex-col justify-center items-start min-h-[110px] min-w-[160px] dark:bg-neutral-800 dark:text-white">
              <div className="flex items-center mb-2">
                {kpi.icon}
                <h3 className="text-sm font-medium uppercase tracking-wider opacity-80">{kpi.title}</h3>
              </div>
              <p className="text-3xl font-bold mt-1 drop-shadow-lg">{kpi.value}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Bookings Trend Chart */}
      <Card className="bg-gradient-to-br from-neutral-50 to-neutral-100 border border-neutral-200 shadow-md dark:bg-neutral-900 dark:border-neutral-700">
        <div className="flex flex-col sm:flex-row flex-wrap justify-between items-start sm:items-center mb-4 px-4 sm:px-6 pt-4 gap-2">
          <h2 className="text-xl font-semibold text-neutral-700">Bookings Trend</h2>
          <div className="w-full sm:w-auto flex flex-row items-center gap-2 mt-2 sm:mt-0">
            <label htmlFor="bookingTimeFilter" className="text-sm text-neutral-600">Period:</label>
            <select 
              id="bookingTimeFilter" 
              value={bookingTimeFilter} 
              onChange={(e) => setBookingTimeFilter(e.target.value)}
              className="p-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary text-sm bg-white w-full sm:w-auto"
            >
              <option value="all">All Time</option>
              <option value="3months">Last 3 Months</option>
              <option value="6months">Last 6 Months</option>
            </select>
          </div>
        </div>
        {monthlyBookingsData.length > 0 ? (
          <div className="px-2 sm:px-6 pb-6">
            <div className="flex items-end space-x-2 sm:space-x-4 h-64 border-l border-b border-neutral-300 p-2 overflow-x-auto bg-gradient-to-t from-white via-neutral-50 to-neutral-100 rounded-md min-w-[320px] dark:bg-neutral-900 dark:border-neutral-700">
              {monthlyBookingsData.map(data => (
                <div key={data.monthYear} className="flex flex-col items-center flex-shrink-0 w-14 sm:w-16 md:w-20">
                  <div 
                    className="w-8 sm:w-10 md:w-12 bg-primary hover:bg-primary-dark transition-all duration-200 rounded-t-lg shadow-md" 
                    style={{ height: `${maxBookingCount > 0 ? (data.count / maxBookingCount) * 100 : 0}%` }}
                    title={`${data.monthYear}: ${data.count} bookings`}
                  >
                     <div className="text-center text-xs text-white pt-1 opacity-0 hover:opacity-100 transition-opacity">
                        {data.count}
                      </div>
                  </div>
                  <p className="text-xs text-neutral-600 mt-1 text-center font-semibold">{data.monthYear}</p>
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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
        <Card title="Property Status Overview (Example)" className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 shadow dark:bg-neutral-800 dark:border-neutral-700">
           <p className="text-neutral-700 font-semibold dark:text-neutral-800">Available: <span className="text-green-600 font-bold dark:text-green-400">{availablePlots}</span></p>
           <p className="text-neutral-700 font-semibold dark:text-neutral-800">Booked: <span className="text-red-500 font-bold dark:text-red-400">{bookedPlots}</span></p>
           {/* This could be a pie chart or more detailed bar chart later */}
        </Card>
        <Card title="Recent Activity (Placeholder)" className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 shadow dark:bg-neutral-800 dark:border-neutral-700">
            <p className="text-neutral-500 dark:text-neutral-800">Coming soon: Recent bookings, payments, user sign-ups...</p>
        </Card>
      </div>

    </div>
  );
};

export default AdminDashboardPage;