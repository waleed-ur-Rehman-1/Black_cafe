'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import Link from 'next/link';

export default function TrackPage() {
  const { ref } = useParams();
  const router = useRouter();
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [cancelling, setCancelling] = useState(false);
  const [cancelError, setCancelError] = useState(null);
  
  const [searchRef, setSearchRef] = useState('');

  useEffect(() => {
    // If ref is missing, redirect to search page
    if (!ref) {
      router.push('/track');
      return;
    }

    const fetchOrder = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/orders/track/${ref}`);
        setOrder(res.data.data);
        setError(null);
      } catch (err) {
        setOrder(null);
        setError(err.response?.data?.message || 'Order not found.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
    const interval = setInterval(fetchOrder, 10000);
    return () => clearInterval(interval);
  }, [ref, router]);

  useEffect(() => {
    if (!order || order.orderStatus === 'CANCELLED' || order.orderStatus === 'DELIVERED' || order.orderStatus === 'COMPLETED') return;
    
    const calculateTimeLeft = () => {
      const createdAt = new Date(order.createdAt).getTime();
      const deadline = createdAt + 5 * 60 * 1000;
      const remaining = deadline - Date.now();
      return remaining > 0 ? Math.floor(remaining / 1000) : 0;
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      const remaining = calculateTimeLeft();
      setTimeLeft(remaining);
      if (remaining <= 0) clearInterval(timer);
    }, 1000);

    return () => clearInterval(timer);
  }, [order]);

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    setCancelling(true);
    setCancelError(null);
    try {
      await api.post(`/orders/${order._id}/cancel`);
      // Refetch immediately
      const res = await api.get(`/orders/track/${ref}`);
      setOrder(res.data.data);
    } catch (err) {
      setCancelError(err.response?.data?.message || 'Failed to cancel order.');
    } finally {
      setCancelling(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchRef.trim()) return;
    router.push(`/track/${searchRef.trim().toUpperCase()}`);
    setSearchRef('');
  };

  if (loading) return <div className="text-center py-32 text-muted font-medium">Loading your order...</div>;
  
  // Fallback if error (Order not found)
  if (error || !order) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-surface border border-border rounded-2xl shadow-2xl p-8 text-center">
          <span className="material-symbols-outlined text-red-500 text-5xl mb-4">search_off</span>
          <h2 className="text-2xl font-bold text-white mb-2">Order Not Found</h2>
          <p className="text-muted mb-6">{error || 'We could not locate this order.'}</p>
          
          <form onSubmit={handleSearch} className="flex flex-col gap-3">
            <input 
              type="text" 
              placeholder="Try another Order Number"
              value={searchRef}
              onChange={(e) => setSearchRef(e.target.value)}
              className="w-full bg-background text-white border border-border rounded-lg p-4 text-center font-mono font-bold uppercase tracking-widest focus:ring-2 focus:ring-primary focus:outline-none"
            />
            <button type="submit" className="w-full bg-primary text-white font-bold text-lg py-3 rounded-lg hover:bg-primary-hover transition-colors shadow-md">
              Search Order
            </button>
          </form>
        </div>
      </div>
    );
  }

  const isCancelled = order.orderStatus === 'CANCELLED';
  const isPickup = order.orderType === 'PICKUP';

  const steps = [
    { key: 'PENDING', label: 'Placed', icon: 'receipt_long' },
    { key: 'ACCEPTED', label: 'Confirmed', icon: 'check_circle' },
    { key: 'PREPARING', label: 'Preparing', icon: 'soup_kitchen' },
    isPickup 
      ? { key: 'READY', label: 'Ready', icon: 'shopping_bag' }
      : { key: 'OUT_FOR_DELIVERY', label: 'On the Way', icon: 'delivery_dining' },
    isPickup
      ? { key: 'COMPLETED', label: 'Picked Up', icon: 'done_all' }
      : { key: 'DELIVERED', label: 'Delivered', icon: 'home' },
  ];

  let currentStepIndex = steps.findIndex(s => s.key === order.orderStatus);
  if (order.orderStatus === 'DELIVERED' || order.orderStatus === 'COMPLETED') currentStepIndex = steps.length - 1;
  if (isCancelled) currentStepIndex = -1;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      
      <div className="text-center mb-10">
        <h1 className="text-3xl font-extrabold text-white mb-2">
          {isCancelled ? 'Order Cancelled' : 'Track Your Order'}
        </h1>
        <p className="text-muted font-medium text-lg">#{order.orderNumber}</p>
      </div>

      {/* Cancellation Alert */}
      {timeLeft > 0 && !isCancelled && (
        <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-orange-500 text-2xl">timer</span>
            <div>
              <p className="font-bold text-orange-500">Need to make a change?</p>
              <p className="text-sm text-orange-400">
                You can cancel for free within <span className="font-bold">{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</span>.
              </p>
            </div>
          </div>
          <button 
            onClick={handleCancel} 
            disabled={cancelling}
            className="px-5 py-2 bg-orange-500 text-white font-bold text-sm rounded-lg hover:bg-orange-600 transition-colors shadow-sm disabled:opacity-50"
          >
            {cancelling ? 'Cancelling...' : 'Cancel Order'}
          </button>
        </div>
      )}

      {cancelError && (
        <div className="bg-red-500/10 text-red-500 border border-red-500/20 p-4 rounded-xl mb-8 text-sm font-semibold">
          {cancelError}
        </div>
      )}
      
      {/* Timeline Tracker */}
      <div className="bg-surface border border-border rounded-2xl p-6 sm:p-8 shadow-lg mb-8 overflow-hidden">
        {isCancelled ? (
          <div className="text-center py-8">
            <span className="material-symbols-outlined text-red-500 text-6xl mb-4">cancel</span>
            <h2 className="text-2xl font-bold text-white mb-2">This order was cancelled</h2>
            <p className="text-muted">If you paid online, your refund is being processed.</p>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row justify-between gap-6 md:gap-2 relative">
            <div className="hidden md:block absolute top-6 left-8 right-8 h-1 bg-border -z-0"></div>
            
            {steps.map((step, index) => {
              const isCompleted = index <= currentStepIndex;
              const isActive = index === currentStepIndex;
              
              return (
                <div key={step.key} className="flex flex-row md:flex-col items-center md:items-center gap-4 md:gap-3 flex-1 relative z-10">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-colors duration-500 ${
                    isCompleted ? 'bg-primary text-white shadow-[0_0_15px_rgba(228,0,43,0.4)]' : 'bg-surface text-muted border border-border'
                  }`}>
                    <span className="material-symbols-outlined text-[24px]">{step.icon}</span>
                  </div>
                  <div className="text-left md:text-center w-full">
                    <p className={`text-sm font-bold ${isCompleted ? 'text-white' : 'text-muted'}`}>{step.label}</p>
                    {isActive && <p className="text-[10px] text-primary font-bold uppercase tracking-widest mt-1">Current</p>}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Order Details Summary */}
      <div className="bg-surface border border-border rounded-2xl p-6 shadow-lg mb-8">
        <h3 className="font-bold text-lg text-white mb-4 border-b border-border pb-4">Order Details</h3>
        
        <div className="space-y-3 mb-6">
          <div className="flex justify-between text-sm">
            <span className="text-muted">Payment Method</span>
            <span className="font-bold text-white">{order.paymentMethod}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted">Payment Status</span>
            <span className={`font-bold ${order.paymentStatus === 'SUCCESS' ? 'text-green-500' : 'text-orange-500'}`}>
              {order.paymentStatus}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted">Order Type</span>
            <span className="font-bold text-white">{order.orderType}</span>
          </div>
        </div>

        <div className="border-t border-border pt-4 flex justify-between items-center">
          <span className="font-bold text-white">Total</span>
          <span className="font-extrabold text-xl text-primary">Rs. {(order.total / 100).toLocaleString()}</span>
        </div>
      </div>

      <div className="bg-surface border border-border rounded-2xl p-6 shadow-lg mb-8">
        <h3 className="font-bold text-white mb-4">Track Another Order</h3>
        <form onSubmit={handleSearch} className="flex gap-3">
          <input 
            type="text" 
            placeholder="Enter Order Number (e.g. BC-...)"
            value={searchRef}
            onChange={(e) => setSearchRef(e.target.value)}
            className="flex-1 bg-background text-white border border-border rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary focus:outline-none uppercase"
          />
          <button type="submit" className="bg-primary text-white font-bold px-6 rounded-lg hover:bg-primary-hover transition">
            Search
          </button>
        </form>
      </div>

      <div className="text-center">
        <Link href="/menu" className="inline-block px-8 py-3 bg-card border border-border text-white font-bold rounded-xl hover:bg-surface transition-colors">
          Back to Menu
        </Link>
      </div>

    </div>
  );
}