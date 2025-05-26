import React, { useEffect, useState } from 'react';
import { getAllProperty } from '../../../api/property/property';
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
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface PropertyStats {
  totalProperties: number;
  rentedProperties: number;
  availableProperties: number;
  totalRevenue: number;
  monthlyStats: {
    month: string;
    rented: number;
    available: number;
    potentialRevenue: number;
  }[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Statistics: React.FC = () => {
  const [stats, setStats] = useState<PropertyStats>({
    totalProperties: 0,
    rentedProperties: 0,
    availableProperties: 0,
    totalRevenue: 0,
    monthlyStats: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await getAllProperty();
        const properties = response.data.data;
        console.log('Fetched properties:', properties);

        // Calculate basic stats
        const totalProperties = properties.length;
        const rentedProperties = properties.filter((prop: any) => prop.isRented).length;
        const availableProperties = totalProperties - rentedProperties;

        // Calculate total potential monthly revenue
        const totalRevenue = properties.reduce((sum: number, prop: any) => sum + (prop.rentPrice || 0), 0);

        // Process monthly data
        const monthlyData: { [key: string]: { rented: number; available: number; potentialRevenue: number } } = {};
        
        properties.forEach((property: any) => {
          const date = new Date(property.createdAt);
          const monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
          
          if (!monthlyData[monthYear]) {
            monthlyData[monthYear] = { rented: 0, available: 0, potentialRevenue: 0 };
          }
          
          if (property.isRented) {
            monthlyData[monthYear].rented += 1;
          } else {
            monthlyData[monthYear].available += 1;
          }
          monthlyData[monthYear].potentialRevenue += property.rentPrice || 0;
        });

        const monthlyStats = Object.entries(monthlyData).map(([month, data]) => ({
          month,
          ...data,
        }));

        setStats({
          totalProperties,
          rentedProperties,
          availableProperties,
          totalRevenue,
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

  const propertyStatusData = [
    { name: 'Rented', value: stats.rentedProperties },
    { name: 'Available', value: stats.availableProperties },
  ];

  return (
    <div className="ml-0 lg:ml-64 p-4 lg:p-8 transition-all duration-300">
      <div className="max-w-full">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Property Statistics</h1>
          <p className="text-gray-600 mt-2">Overview of property rentals and revenue</p>
        </div>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Total Properties</h2>
            <p className="text-3xl font-bold text-blue-600">{stats.totalProperties}</p>
            <p className="text-sm text-gray-500 mt-2">Listed properties</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Rented Properties</h2>
            <p className="text-3xl font-bold text-green-600">{stats.rentedProperties}</p>
            <p className="text-sm text-gray-500 mt-2">Currently rented</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Available Properties</h2>
            <p className="text-3xl font-bold text-yellow-600">{stats.availableProperties}</p>
            <p className="text-sm text-gray-500 mt-2">Ready to rent</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Potential Monthly Revenue</h2>
            <p className="text-3xl font-bold text-purple-600">
              Rs. {stats.totalRevenue.toLocaleString()}
            </p>
            <p className="text-sm text-gray-500 mt-2">Total monthly rent possible</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Property Status Pie Chart */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Property Status Distribution</h2>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={propertyStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {propertyStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Monthly Property Status Chart */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Monthly Property Status</h2>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.monthlyStats} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" angle={-45} textAnchor="end" height={60} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="rented" name="Rented Properties" fill="#00C49F" />
                  <Bar dataKey="available" name="Available Properties" fill="#0088FE" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Monthly Revenue Potential Chart */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 col-span-1 lg:col-span-2">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Monthly Revenue Potential</h2>
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
                    dataKey="potentialRevenue"
                    name="Potential Revenue (Rs.)"
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