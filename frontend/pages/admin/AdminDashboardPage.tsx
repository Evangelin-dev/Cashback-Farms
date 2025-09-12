import { ArchiveBoxIcon, CheckCircleIcon, CircleStackIcon, CurrencyRupeeIcon, UsersIcon } from '@heroicons/react/24/outline';
import { CircularProgress } from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';
import Card from '../../components/common/Cards/Card';
import apiClient from '../../src/utils/api/apiClient';

interface PlotStats {
  total: number;
  booked: number;
  available: number;
}
interface UserStats {
  total_users: number;
}
interface PaymentStats {
  total_revenue: number;
}
interface MonthlyBookingData {
  monthYear: string; 
  count: number;
}


type KpiCardType = {
    title: string;
    dataKey: keyof PlotStats | keyof UserStats | keyof PaymentStats;
    color: string;
    Icon: React.ComponentType<{ className?: string }>;
};

const kpiCards: KpiCardType[] = [
    { title: "Total Plots", dataKey: 'total', color: "bg-blue-500", Icon: CircleStackIcon },
    { title: "Booked Plots", dataKey: 'booked', color: "bg-red-500", Icon: ArchiveBoxIcon },
    { title: "Available Plots", dataKey: 'available', color: "bg-green-500", Icon: CheckCircleIcon },
    { title: "Registered Users", dataKey: 'total_users', color: "bg-yellow-500", Icon: UsersIcon },
    { title: "Total Revenue", dataKey: 'total_revenue', color: "bg-purple-500", Icon: CurrencyRupeeIcon },
];


const AdminDashboardPage: React.FC = () => {
  const [plotStats, setPlotStats] = useState<PlotStats | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [paymentStats, setPaymentStats] = useState<PaymentStats | null>(null);
  const [monthlyBookings, setMonthlyBookings] = useState<MonthlyBookingData[]>([]);
  
  const [bookingTimeFilter, setBookingTimeFilter] = useState<string>('all'); 
  const [isKpiLoading, setIsKpiLoading] = useState(true);
  const [isChartLoading, setIsChartLoading] = useState(true);

  
  useEffect(() => {
    const fetchKpiData = async () => {
      setIsKpiLoading(true);
      try {
        const [plots, users, revenue] = await Promise.all([
          apiClient.get<PlotStats>('/admin/dashboard/plot-stats/'),
          apiClient.get<UserStats>('/admin/dashboard/user-stats/'),
          apiClient.get<PaymentStats>('/admin/dashboard/payment-stats/')
        ]);
        setPlotStats(plots);
        setUserStats(users);
        setPaymentStats(revenue);
      } catch (error) {
        console.error("Failed to fetch KPI dashboard data:", error);
      } finally {
        setIsKpiLoading(false);
      }
    };
    fetchKpiData();
  }, []);

  useEffect(() => {
    const fetchMonthlyBookings = async () => {
      setIsChartLoading(true);
      try {
        const response = await apiClient.get<MonthlyBookingData[]>(`/admin/dashboard/monthly-bookings/?range=${bookingTimeFilter}`);
        setMonthlyBookings(response || []);
      } catch (error) {
        console.error("Failed to fetch monthly bookings data:", error);
        setMonthlyBookings([]);
      } finally {
        setIsChartLoading(false);
      }
    };
    fetchMonthlyBookings();
  }, [bookingTimeFilter]);

  
  const getKpiValue = (card: KpiCardType) => {
    if (isKpiLoading) return <CircularProgress size={28} color="inherit" />;
    
    let value: number | undefined;
    if (card.dataKey in (plotStats || {})) {
        value = plotStats?.[card.dataKey as keyof PlotStats];
    } else if (card.dataKey in (userStats || {})) {
        value = userStats?.[card.dataKey as keyof UserStats];
    } else if (card.dataKey in (paymentStats || {})) {
        value = paymentStats?.[card.dataKey as keyof PaymentStats];
    }

    if (value === undefined) return '...';

    
    return card.dataKey === 'total_revenue' 
      ? `₹${value.toLocaleString('en-IN')}` 
      : value.toLocaleString('en-IN');
  };

  const maxBookingCount = useMemo(() => 
    monthlyBookings.reduce((max, item) => Math.max(max, item.count), 0) || 1
  , [monthlyBookings]);

  return (
    <div className="space-y-6 p-4 md:p-6">
      <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {kpiCards.map((card) => (          
          <div key={card.title} className={`${card.color} relative overflow-hidden rounded-xl p-5 text-white shadow-lg transition-transform duration-300 hover:-translate-y-1 hover:shadow-2xl`}>
            <card.Icon className="absolute -right-4 -bottom-4 h-28 w-28 text-white opacity-20" />
            <div className="flex items-center gap-2">
              <div className='rounded-full bg-black bg-opacity-20 p-1.5'>
                 <card.Icon className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-semibold uppercase tracking-wider">{card.title}</h3>
            </div>
            <p className="mt-2 text-4xl font-bold drop-shadow-lg">
              {getKpiValue(card)}
            </p>
          </div>
        ))}
      </div>

      <Card className="bg-white border border-gray-200 shadow-sm">
        <div className="flex flex-col sm:flex-row flex-wrap justify-between items-start sm:items-center mb-4 px-4 sm:px-6 pt-4 gap-2">
          <h2 className="text-xl font-semibold text-gray-700">Bookings Trend</h2>
          <div className="flex items-center gap-2">
            <label htmlFor="bookingTimeFilter" className="text-sm text-gray-600">Period:</label>
            <select 
              id="bookingTimeFilter" 
              value={bookingTimeFilter} 
              onChange={(e) => setBookingTimeFilter(e.target.value)}
              className="p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm bg-white"
            >
              <option value="all">All Time</option>
              <option value="3months">Last 3 Months</option>
              <option value="6months">Last 6 Months</option>
            </select>
          </div>
        </div>
        
        <div className="px-4 pb-6 min-h-[300px] flex items-center justify-center">
          {isChartLoading ? (
            <CircularProgress />
          ) : monthlyBookings.length > 0 ? (
            <div className="w-full">
              <div className="flex items-end space-x-4 h-64 border-l border-b border-gray-300 p-2 overflow-x-auto rounded-md">
                {monthlyBookings.map(data => (
                  <div key={data.monthYear} className="flex flex-col items-center flex-shrink-0 w-16">
                    <div 
                      className="w-10 bg-blue-500 hover:bg-blue-600 transition-all duration-200 rounded-t-md shadow-sm" 
                      style={{ height: `${(data.count / maxBookingCount) * 100}%` }}
                      title={`${data.monthYear}: ${data.count} bookings`}
                    >
                       <div className="text-center text-xs text-white pt-1 opacity-0 hover:opacity-100 transition-opacity">
                          {data.count}
                        </div>
                    </div>
                    <p className="text-xs text-gray-600 mt-2 text-center font-medium">{data.monthYear}</p>
                  </div>
                ))}
              </div>
               <p className="text-xs text-gray-500 mt-2 text-center">Number of bookings per month.</p>
            </div>
          ) : (
            <div className="text-center py-10 px-6">
              <p className="text-gray-500">No booking data available for the selected period.</p>
            </div>
          )}
        </div>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        <Card title="Property Status Overview" className="bg-white border border-gray-200 shadow-sm">
           <div className="space-y-2 text-lg">
             <div className="flex justify-between items-center">
               <span className="font-medium text-gray-600">Available:</span>
               <span className="font-bold text-green-600">{plotStats?.available ?? '...'}</span>
             </div>
             <div className="flex justify-between items-center">
               <span className="font-medium text-gray-600">Booked:</span>
               <span className="font-bold text-red-500">{plotStats?.booked ?? '...'}</span>
             </div>
           </div>
        </Card>
        <Card title="Recent Activity" className="bg-white border border-gray-200 shadow-sm">
            <p className="text-gray-500">Coming soon...</p>
        </Card>
      </div>

    </div>
  );
};

export default AdminDashboardPage;