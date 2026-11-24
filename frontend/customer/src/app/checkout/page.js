'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useBranch } from '@/context/BranchContext';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';

export default function CheckoutPage() {
  const { items, total, clear } = useCart();
  const { branch } = useBranch();
  const { user } = useAuth();
  const router = useRouter();
  
  const [orderType, setOrderType] = useState('DELIVERY');
  const [paymentMethod, setPaymentMethod] = useState('COD');
  
  // Auto-fill guest info if user is logged in
  const [guest, setGuest] = useState({ 
    name: user?.name || '', 
    phone: user?.phone || '', 
    email: user?.email || '' 
  });
  
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (items.length === 0 && !isRedirecting) router.push('/cart');
  }, [items, router, isRedirecting]);

  const placeOrder = async () => {
    if (!branch || !branch._id) {
      return setError('Your branch selection is invalid. Please click "Set Location" in the top menu to refresh it.');
    }
    if (!guest.name.trim() || !guest.phone.trim()) {
      return setError('Please provide your name and phone number.');
    }
    if (orderType === 'DELIVERY' && !address.trim()) {
      return setError('Please provide a delivery address.');
    }

    setLoading(true); 
    setError(null);
    
    try {
      const payload = {
        branchId: branch._id,
        orderType,
        paymentMethod,
        items: items.map(i => ({
          productId: i.productId,
          variantId: i.variantId || undefined,
          addonIds: i.addonIds || [],
          quantity: i.quantity,
          instructions: i.instructions || ''
        })),
        guestDetails: guest // Always send contact info
      };

      if (orderType === 'DELIVERY') {
        payload.deliveryAddress = { address, latitude: 24.8607, longitude: 67.0011 };
      }

      const res = await api.post('/orders', payload);
      const order = res.data.data;
      setIsRedirecting(true);

      if (paymentMethod === 'COD' || paymentMethod === 'CASH_PICKUP') {
        clear();
        router.push(`/track/${order.orderNumber}`);
      } else {
        const payRes = await api.post('/payments/initiate', { orderId: order._id, method: paymentMethod });
        clear();
        router.push(`/pay/${order._id}?ref=${payRes.data.data.payment.transactionReference}&method=${paymentMethod}`);
      }
      
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Something went wrong. Please try again.';
      setError(errorMsg);
      setLoading(false);
    }
  };

  if (items.length === 0 && !isRedirecting) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8 text-white">Checkout</h1>
      
      {error && (
        <div className="bg-red-900/50 text-red-200 border border-red-500 p-4 rounded-lg mb-6 flex items-center gap-2">
          <span className="material-symbols-outlined">error</span>
          <p className="font-semibold">{error}</p>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        
        <div className="flex-1 space-y-6">
          
          {/* 1. Contact Information (Always Visible) */}
          <div className="bg-surface border border-border rounded-xl p-6 shadow-sm">
            <h2 className="font-bold text-lg mb-4 text-white">1. Contact Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" placeholder="Full Name *" value={guest.name} onChange={e => setGuest({ ...guest, name: e.target.value })} className="w-full bg-background text-white border border-border rounded-lg p-3 focus:ring-2 focus:ring-primary focus:outline-none" />
              <input type="text" placeholder="Phone Number *" value={guest.phone} onChange={e => setGuest({ ...guest, phone: e.target.value })} className="w-full bg-background text-white border border-border rounded-lg p-3 focus:ring-2 focus:ring-primary focus:outline-none" />
              <input type="email" placeholder="Email (Optional)" value={guest.email} onChange={e => setGuest({ ...guest, email: e.target.value })} className="w-full bg-background text-white border border-border rounded-lg p-3 focus:ring-2 focus:ring-primary focus:outline-none md:col-span-2" />
            </div>
          </div>

          {/* 2. Order Type */}
          <div className="bg-surface border border-border rounded-xl p-6 shadow-sm">
            <h2 className="font-bold text-lg mb-4 text-white">2. How would you like your order?</h2>
            <div className="flex gap-4">
              <button onClick={() => setOrderType('DELIVERY')} className={`flex-1 py-3 rounded-lg border-2 font-bold transition-all ${orderType === 'DELIVERY' ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted hover:border-gray-500'}`}>Delivery</button>
              <button onClick={() => setOrderType('PICKUP')} className={`flex-1 py-3 rounded-lg border-2 font-bold transition-all ${orderType === 'PICKUP' ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted hover:border-gray-500'}`}>Pickup</button>
            </div>
          </div>

          {/* 3. Delivery Address (Only for Delivery) */}
          {orderType === 'DELIVERY' && (
            <div className="bg-surface border border-border rounded-xl p-6 shadow-sm">
              <h2 className="font-bold text-lg mb-4 text-white">3. Delivery Address</h2>
              <textarea value={address} onChange={e => setAddress(e.target.value)} className="w-full bg-background text-white border border-border rounded-lg p-3 focus:ring-2 focus:ring-primary focus:outline-none" rows={3} placeholder="House/Apartment, Street, Area, City" />
            </div>
          )}

          {/* 4. Payment Method */}
          <div className="bg-surface border border-border rounded-xl p-6 shadow-sm">
            <h2 className="font-bold text-lg mb-4 text-white">4. Payment Method</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {['COD', 'CASH_PICKUP', 'CARD', 'EASYPAISA', 'JAZZCASH'].map(m => (
                <button key={m} onClick={() => setPaymentMethod(m)} className={`py-3 px-2 rounded-lg border-2 text-sm font-bold transition-all ${paymentMethod === m ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted hover:border-gray-500'}`}>
                  {m.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-[380px] shrink-0">
          <div className="bg-surface border border-border rounded-xl p-6 shadow-sm sticky top-24">
            <h2 className="font-bold text-lg mb-4 text-white">Order Summary</h2>
            
            <div className="space-y-3 mb-6 max-h-60 overflow-y-auto pr-2">
              {items.map(i => (
                <div key={i._key} className="flex justify-between text-sm">
                  <div className="flex gap-2">
                    <span className="font-bold text-white">{i.quantity}x</span>
                    <div>
                      <p className="font-semibold text-white">{i.name}</p>
                      {i.variantName && <p className="text-xs text-muted">{i.variantName}</p>}
                    </div>
                  </div>
                  <span className="font-semibold text-white">Rs. {((i.unitPrice * i.quantity) / 100).toLocaleString()}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-border pt-4 space-y-2 mb-6 text-sm">
              <div className="flex justify-between text-muted"><span>Subtotal</span><span>Rs. {(total / 100).toLocaleString()}</span></div>
              <div className="flex justify-between text-muted"><span>Delivery Fee</span><span>{orderType === 'PICKUP' ? 'Rs. 0' : 'Calculated at branch'}</span></div>
              <div className="flex justify-between font-bold text-lg text-white pt-2 border-t border-border mt-2">
                <span>Total</span>
                <span className="text-primary">Rs. {(total / 100).toLocaleString()}</span>
              </div>
            </div>

            <button onClick={placeOrder} disabled={loading} className="w-full bg-primary text-white font-bold text-lg py-4 rounded-lg hover:bg-primary-hover transition-colors disabled:opacity-50 flex justify-center items-center">
              {loading ? 'Processing...' : 'Place Order'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}