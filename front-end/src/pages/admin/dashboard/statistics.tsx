import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';

interface BookingStats {
  totalBookings: number;
  monthlyStats: {
    month: string;
    count: number;
    revenue: number;
  }[];
}

const Statistics: React.FC = () => {
  const [stats, setStats] = useState<BookingStats>({
    totalBookings: 0,
    monthlyStats: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('/api/property-bookings');
        const bookings = response.data.data;

        // Process bookings data
        const monthlyData: { [key: string]: { count: number; revenue: number } } = {};
        
        bookings.forEach((booking: any) => {
          const date = new Date(booking.createdAt);
          const monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
          
          if (!monthlyData[monthYear]) {
            monthlyData[monthYear] = { count: 0, revenue: 0 };
          }
          
          monthlyData[monthYear].count += 1;
          monthlyData[monthYear].revenue += booking.totalPrice;
        });

        const monthlyStats = Object.entries(monthlyData).map(([month, data]) => ({
          month,
          count: data.count,
          revenue: data.revenue,
        }));

        setStats({
          totalBookings: bookings.length,
          monthlyStats: monthlyStats.sort((a, b) => {
            const [monthA, yearA] = a.month.split(' ');
            const [monthB, yearB] = b.month.split(' ');
            return new Date(`${monthA} 1, ${yearA}`).getTime() - new Date(`${monthB} 1, ${yearB}`).getTime();
          }),
        });
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching statistics:', error);
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="ml-0 lg:ml-64 p-4 lg:p-8 transition-all duration-300"> {/* Adjusted margin for sidebar */}
      <div className="max-w-full">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Rental Statistics</h1>
          <p className="text-gray-600 mt-2">Overview of property rentals and revenue</p>
        </div>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Total Bookings</h2>
            <p className="text-3xl font-bold text-blue-600">{stats.totalBookings}</p>
            <p className="text-sm text-gray-500 mt-2">All time bookings</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Monthly Average</h2>
            <p className="text-3xl font-bold text-green-600">
              {(stats.totalBookings / Math.max(1, stats.monthlyStats.length)).toFixed(1)}
            </p>
            <p className="text-sm text-gray-500 mt-2">Bookings per month</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Total Revenue</h2>
            <p className="text-3xl font-bold text-purple-600">
              Rs. {stats.monthlyStats.reduce((sum, stat) => sum + stat.revenue, 0).toLocaleString()}
            </p>
            <p className="text-sm text-gray-500 mt-2">All time revenue</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Bookings Chart */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Monthly Bookings</h2>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.monthlyStats} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" angle={-45} textAnchor="end" height={60} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" name="Number of Bookings" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Monthly Revenue Chart */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Monthly Revenue</h2>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats.monthlyStats} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" angle={-45} textAnchor="end" height={60} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    name="Revenue (Rs.)"
                    stroke="#8B5CF6"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;