'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import Link from 'next/link';

export default function AccountPage() {
  const { user, loading: authLoading, logout } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If not logged in, redirect to login
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }

    // Fetch user's orders
    if (user) {
      api.get('/orders/my-orders')
        .then(res => setOrders(res.data.data || []))
        .catch(err => console.error("Failed to load orders", err))
        .finally(() => setLoading(false));
    }
  }, [user, authLoading, router]);

  if (authLoading || loading) return <div className="text-center py-32 text-muted">Loading your account...</div>;
  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row items-center justify-between bg-surface border border-border rounded-2xl p-6 shadow-lg mb-10 gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center text-primary text-2xl font-bold">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">{user.name}</h1>
            <p className="text-muted text-sm">{user.email} • {user.phone}</p>
          </div>
        </div>
        <button onClick={logout} className="px-6 py-2 bg-background border border-border text-white font-bold rounded-lg hover:border-primary transition">
          Logout
        </button>
      </div>

      {/* Order History */}
      <h2 className="text-2xl font-bold text-white mb-6">My Order History</h2>
      
      {orders.length === 0 ? (
        <div className="text-center bg-surface border border-border rounded-2xl p-12">
          <span className="material-symbols-outlined text-6xl text-muted mb-4">receipt_long</span>
          <h3 className="text-xl font-bold text-white mb-2">No orders yet</h3>
          <p className="text-muted mb-6">You haven't placed any orders with us yet.</p>
          <Link href="/menu" className="bg-primary text-white font-bold px-6 py-2.5 rounded-lg hover:bg-primary-hover transition">
            Start Ordering
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order._id} className="bg-surface border border-border rounded-xl p-5 flex flex-col md:flex-row justify-between items-center gap-4 shadow-sm">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-bold text-white text-lg">{order.orderNumber}</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    order.orderStatus === 'DELIVERED' || order.orderStatus === 'COMPLETED' ? 'bg-green-500/20 text-green-500' :
                    order.orderStatus === 'CANCELLED' ? 'bg-red-500/20 text-red-500' :
                    'bg-yellow-500/20 text-yellow-500'
                  }`}>
                    {order.orderStatus}
                  </span>
                </div>
                <p className="text-muted text-sm">
                  {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()} • {order.items.length} items
                </p>
              </div>
              <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                <span className="font-black text-white text-lg">Rs. {(order.total / 100).toLocaleString()}</span>
                <Link href={`/track/${order.orderNumber}`} className="bg-background border border-border text-white px-4 py-2 rounded-lg font-semibold text-sm hover:border-primary transition">
                  Track Order
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}