import { useEffect, useState } from 'react';
import api from '../services/api';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  useEffect(() => {
    api.get('/admin/analytics/dashboard').then(r => setStats(r.data.data)).catch(() => {});
  }, []);
  if (!stats) return <p className="text-muted">Loading...</p>;

  const cards = [
    ['Total Orders', stats.totalOrders],
    ['Today Orders', stats.todayOrders],
    ['Pending', stats.pendingOrders],
    ['Low Stock', stats.lowStock],
    ['Revenue (PKR)', (stats.totalRevenuePaisa / 100).toFixed(0)],
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {cards.map(([label, value]) => (
          <div key={label} className="bg-card border border-border rounded-xl p-4">
            <p className="text-muted text-sm">{label}</p>
            <p className="text-2xl font-bold mt-2">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}