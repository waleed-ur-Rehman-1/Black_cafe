'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import api from '@/lib/api';

export default function PaymentPage() {
  const { orderId } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [orderTotal, setOrderTotal] = useState(0);
  
  const txRef = searchParams.get('ref');
  const method = searchParams.get('method');

  // Card Form State
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardName, setCardName] = useState('');

  // Fetch order details to show the amount
  useEffect(() => {
    api.get(`/orders/${orderId}`)
      .then(res => setOrderTotal(res.data.data.total))
      .catch(() => {});
  }, [orderId]);

  const simulatePayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Simulate network delay for realism
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Send webhook to confirm payment
      await api.post(`/payments/webhooks/${method.toLowerCase()}`, {
        transactionReference: txRef,
        status: 'SUCCESS',
        gatewayReference: `GW-MOCK-${Date.now()}`,
        amount: orderTotal, 
      });

      // Redirect to tracking page using order ID
      router.push(`/track/${orderId}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Payment failed. Please try again.');
      setLoading(false);
    }
  };

  // Format card number as 4242 4242 4242 4242
  const handleCardChange = (e) => {
    let val = e.target.value.replace(/\D/g, '');
    val = val.replace(/(.{4})/g, '$1 ').trim();
    setCardNumber(val.slice(0, 19));
  };

  // Format expiry as MM/YY
  const handleExpiryChange = (e) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length >= 2) val = val.slice(0, 2) + '/' + val.slice(2, 4);
    setExpiry(val);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-surface border border-border rounded-2xl shadow-2xl p-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-primary text-3xl">lock</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">Secure Checkout</h1>
          <p className="text-muted text-sm">Amount to pay: <span className="font-bold text-primary">Rs. {(orderTotal / 100).toLocaleString()}</span></p>
        </div>

        {error && (
          <div className="bg-red-500/10 text-red-500 p-3 rounded-lg mb-6 text-sm text-center font-bold">
            {error}
          </div>
        )}

        {/* Card Form */}
        {method === 'CARD' ? (
          <form onSubmit={simulatePayment} className="space-y-4">
            <div className="bg-blue-600 rounded-xl p-5 text-white mb-6 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-xl"></div>
              
              <div className="flex justify-between items-center mb-6">
                <span className="material-symbols-outlined text-3xl">contactless</span>
                <span className="font-bold italic text-lg tracking-wider">VISA / MASTER</span>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-white/70 block mb-1">Card Number</label>
                  <input 
                    required
                    value={cardNumber}
                    onChange={handleCardChange}
                    placeholder="4242 4242 4242 4242"
                    className="w-full bg-transparent border-b border-white/30 text-white placeholder-white/40 text-lg font-mono focus:border-white focus:outline-none pb-1"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-white/70 block mb-1">Expiry</label>
                    <input required value={expiry} onChange={handleExpiryChange} placeholder="MM/YY" className="w-full bg-transparent border-b border-white/30 text-white placeholder-white/40 text-lg font-mono focus:border-white focus:outline-none pb-1" />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-white/70 block mb-1">CVV</label>
                    <input required type="password" value={cvv} onChange={e => setCvv(e.target.value.replace(/\D/g,'').slice(0,3))} placeholder="123" className="w-full bg-transparent border-b border-white/30 text-white placeholder-white/40 text-lg font-mono focus:border-white focus:outline-none pb-1" />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-white/70 block mb-1">Name on Card</label>
                  <input required value={cardName} onChange={e => setCardName(e.target.value)} placeholder="John Doe" className="w-full bg-transparent border-b border-white/30 text-white placeholder-white/40 text-sm font-sans focus:border-white focus:outline-none pb-1" />
                </div>
              </div>
            </div>

            <div className="bg-background border border-border p-3 rounded-lg flex items-center justify-between text-xs text-muted mb-4">
              <span>💡 Test Mode: Use 4242 4242 4242 4242</span>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white font-bold text-lg py-3 rounded-lg hover:bg-primary-hover transition-colors shadow-md disabled:opacity-50"
            >
              {loading ? 'Processing Payment...' : `Pay Rs. ${(orderTotal / 100).toLocaleString()}`}
            </button>
          </form>
        ) : (
          /* Fake Wallet/Easypaisa view */
          <div className="space-y-6">
             <div className="bg-background border border-border rounded-xl p-6 text-center">
               <span className="material-symbols-outlined text-4xl text-muted mb-2">account_balance_wallet</span>
               <p className="text-muted text-sm mb-1">Paying via {method}</p>
               <p className="font-mono text-xs text-white break-all bg-surface p-2 rounded mt-4">{txRef}</p>
             </div>
             <button onClick={simulatePayment} disabled={loading} className="w-full bg-primary text-white font-bold text-lg py-3 rounded-lg hover:bg-primary-hover transition-colors shadow-md disabled:opacity-50">
              {loading ? 'Connecting...' : 'Confirm Payment'}
            </button>
          </div>
        )}

        <p className="text-center text-xs text-muted mt-6">
          <span className="material-symbols-outlined text-[12px] align-middle mr-1">lock</span> 
          Encrypted and secure transaction
        </p>
      </div>
    </div>
  );
}