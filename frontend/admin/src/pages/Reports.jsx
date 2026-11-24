import { useEffect, useState } from 'react';
import api from '../services/api';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

export default function Reports() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/analytics/dashboard')
      .then(res => setStats(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-12 text-center text-muted">Loading analytics...</div>;
  if (!stats) return <div className="p-12 text-center text-red-500">Failed to load analytics data.</div>;

  // Format data for charts
  const orderData = [
    { name: 'Total Orders', count: stats.totalOrders },
    { name: "Today's Orders", count: stats.todayOrders },
    { name: 'Pending', count: stats.pendingOrders },
  ];

  const revenueData = [
    { name: 'Revenue (PKR)', value: stats.totalRevenuePaisa / 100 },
    { name: 'Pending Revenue', value: (stats.totalOrders - stats.todayOrders) * 500 }, // Mock pending revenue for visual
  ];

  const COLORS = ['#E4002B', '#4B5563'];

  // Custom Tooltip for the charts to match the dark theme
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-surface border border-border p-3 rounded-lg shadow-xl">
          <p className="text-white font-bold mb-1">{label || payload[0].name}</p>
          <p className="text-primary font-black">
            {payload[0].name.includes('Revenue') ? `Rs. ${payload[0].value.toLocaleString()}` : payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Financial Reports & Analytics</h1>
      
      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-card border border-border p-6 rounded-xl shadow-lg">
          <p className="text-sm font-semibold text-muted mb-1">Total Revenue (All Time)</p>
          <h3 className="text-3xl font-black text-primary">
            Rs. {(stats.totalRevenuePaisa / 100).toLocaleString()}
          </h3>
        </div>
        <div className="bg-card border border-border p-6 rounded-xl shadow-lg">
          <p className="text-sm font-semibold text-muted mb-1">Total Orders</p>
          <h3 className="text-3xl font-black text-white">{stats.totalOrders}</h3>
        </div>
        <div className="bg-card border border-border p-6 rounded-xl shadow-lg">
          <p className="text-sm font-semibold text-muted mb-1">Today's Orders</p>
          <h3 className="text-3xl font-black text-white">{stats.todayOrders}</h3>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Bar Chart: Orders */}
        <div className="bg-card border border-border p-6 rounded-xl shadow-lg">
          <h2 className="text-lg font-bold text-white mb-6">Order Breakdown</h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={orderData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333333" vertical={false} />
                <XAxis dataKey="name" stroke="#A3A3A3" tick={{ fill: '#A3A3A3', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis stroke="#A3A3A3" tick={{ fill: '#A3A3A3', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#202020' }} />
                <Bar dataKey="count" fill="#E4002B" radius={[4, 4, 0, 0]} maxBarSize={60} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart: Revenue */}
        <div className="bg-card border border-border p-6 rounded-xl shadow-lg">
          <h2 className="text-lg font-bold text-white mb-6">Revenue Distribution</h2>
          <div className="h-[300px] w-full flex justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={revenueData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {revenueData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ color: '#fff' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}