import { useEffect, useState } from 'react';
import api from '../services/api';
import OrderReceiptModal from '../components/OrderReceiptModal';

const STATES = ['PENDING', 'ACCEPTED', 'PREPARING', 'READY', 'OUT_FOR_DELIVERY', 'DELIVERED', 'COMPLETED', 'CANCELLED'];

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const loadOrders = () => {
    api.get('/orders/admin/all').then(res => setOrders(res.data.data || [])).catch(() => {});
  };

  useEffect(() => { loadOrders(); }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/orders/${id}/status`, { status });
      loadOrders();
    } catch (err) { alert('Error updating status'); }
  };

  const filtered = filter ? orders.filter(o => o.orderStatus === filter) : orders;

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Customer Orders</h1>
          <p className="text-muted text-sm mt-1">Manage and print receipts for all incoming orders.</p>
        </div>
        <select 
          value={filter} 
          onChange={e => setFilter(e.target.value)} 
          className="bg-surface border border-border rounded-lg px-4 py-2 font-semibold text-white outline-none focus:border-primary w-full md:w-auto"
        >
          <option value="">All Order States</option>
          {STATES.map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
        </select>
      </div>

      {/* Order Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filtered.map(o => {
          const customerName = o.guestDetails?.name || o.customerId?.name || 'Guest';
          const customerPhone = o.guestDetails?.phone || o.customerId?.phone || 'No phone';
          const customerEmail = o.guestDetails?.email || o.customerId?.email || '';
          
          // Get initials for the avatar
          const initials = customerName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

          return (
            <div key={o._id} className="bg-card border border-border rounded-xl shadow-lg flex flex-col overflow-hidden">
              
              {/* Card Header */}
              <div className="bg-surface p-4 border-b border-border flex justify-between items-center">
                <div>
                  <span className="font-black text-white text-lg">{o.orderNumber}</span>
                  <p className="text-xs text-muted">{new Date(o.createdAt).toLocaleString()}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  o.orderStatus === 'PENDING' ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/30' :
                  o.orderStatus === 'CANCELLED' ? 'bg-red-500/20 text-red-500 border border-red-500/30' :
                  'bg-green-500/20 text-green-500 border border-green-500/30'
                }`}>
                  {o.orderStatus.replace(/_/g, ' ')}
                </span>
              </div>

              {/* Customer Profile Section */}
              <div className="p-5 border-b border-border">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/20 text-primary border border-primary/30 flex items-center justify-center font-black text-lg shrink-0">
                    {initials}
                  </div>
                  <div className="overflow-hidden">
                    <h3 className="font-bold text-white text-lg truncate">{customerName}</h3>
                    <p className="text-sm text-primary font-semibold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">call</span> {customerPhone}
                    </p>
                    {customerEmail && (
                      <p className="text-xs text-muted truncate mt-0.5">{customerEmail}</p>
                    )}
                  </div>
                </div>
                
                {/* Delivery Address */}
                {o.orderType === 'DELIVERY' && o.deliveryAddress?.address && (
                  <div className="mt-4 bg-background p-3 rounded-lg border border-border flex items-start gap-2">
                    <span className="material-symbols-outlined text-muted text-[18px] mt-0.5">location_on</span>
                    <p className="text-sm text-gray-300 leading-tight">{o.deliveryAddress.address}</p>
                  </div>
                )}
              </div>

              {/* Items Summary Section */}
              <div className="p-5 flex-1">
                <h4 className="text-xs font-bold text-muted uppercase tracking-wider mb-3">Order Items</h4>
                <ul className="space-y-2">
                  {o.items?.slice(0, 3).map((item, idx) => (
                    <li key={idx} className="flex justify-between text-sm text-white">
                      <span className="truncate pr-4">{item.quantity}x {item.productName}</span>
                      <span className="font-semibold text-gray-400">Rs. {((item.unitPrice * item.quantity) / 100).toLocaleString()}</span>
                    </li>
                  ))}
                  {o.items?.length > 3 && (
                    <li className="text-xs text-primary font-bold mt-1">
                      + {o.items.length - 3} more items...
                    </li>
                  )}
                </ul>
              </div>

              {/* Card Footer: Total & Actions */}
              <div className="bg-surface p-4 border-t border-border mt-auto">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-muted font-semibold">Total Amount</span>
                  <span className="text-xl font-black text-primary">Rs. {(o.total / 100).toLocaleString()}</span>
                </div>
                
                <div className="flex gap-2">
                  {/* Print Receipt Button - Big & Easy */}
                  <button 
                    onClick={() => setSelectedOrder(o)}
                    className="flex-1 bg-white text-black hover:bg-gray-200 py-2.5 rounded-lg font-bold transition flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[20px]">print</span>
                    Print Bill
                  </button>

                  {/* Status Dropdown */}
                  <select 
                    onChange={e => updateStatus(o._id, e.target.value)} 
                    defaultValue=""
                    className="w-1/3 bg-background border border-border rounded-lg px-2 py-2.5 text-xs font-bold text-white outline-none focus:border-primary"
                  >
                    <option value="" disabled>Status...</option>
                    {STATES.map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
                  </select>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 bg-card border border-border rounded-xl mt-6">
          <span className="material-symbols-outlined text-6xl text-muted mb-4">search_off</span>
          <p className="text-muted text-lg">No orders found for this filter.</p>
        </div>
      )}

      {/* Render the Receipt Modal */}
      {selectedOrder && (
        <OrderReceiptModal 
          order={selectedOrder} 
          onClose={() => setSelectedOrder(null)} 
        />
      )}
    </div>
  );
}