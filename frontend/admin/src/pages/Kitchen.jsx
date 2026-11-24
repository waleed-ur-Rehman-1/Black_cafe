import { useEffect, useState } from 'react';
import api from '../services/api';

export default function Kitchen() {
  const [orders, setOrders] = useState([]);

  const loadOrders = () => {
    // We only want orders that need kitchen action
    api.get('/orders/admin/all').then(res => {
      const activeOrders = res.data.data.filter(o => 
        ['PENDING', 'ACCEPTED', 'PREPARING', 'READY'].includes(o.orderStatus)
      );
      setOrders(activeOrders);
    }).catch(() => {});
  };

  useEffect(() => {
    loadOrders();
    const interval = setInterval(loadOrders, 10000); // Refresh every 10s
    return () => clearInterval(interval);
  }, []);

  const moveOrder = async (id, newStatus) => {
    try {
      await api.patch(`/orders/${id}/status`, { status: newStatus });
      loadOrders();
    } catch (err) { alert('Error moving order'); }
  };

  const columns = [
    { id: 'PENDING', title: 'New Orders', color: 'border-blue-500' },
    { id: 'ACCEPTED', title: 'Accepted', color: 'border-yellow-500' },
    { id: 'PREPARING', title: 'Preparing', color: 'border-orange-500' },
    { id: 'READY', title: 'Ready for Pickup/Delivery', color: 'border-green-500' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Kitchen Display System</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {columns.map(col => (
          <div key={col.id} className="bg-surface rounded-xl border border-border p-4 flex flex-col h-[calc(100vh-150px)]">
            <h2 className="font-bold text-white mb-4 pb-2 border-b border-border flex justify-between">
              {col.title}
              <span className="bg-card px-2 py-0.5 rounded text-sm">{orders.filter(o => o.orderStatus === col.id).length}</span>
            </h2>
            
            <div className="flex-1 overflow-y-auto space-y-3">
              {orders.filter(o => o.orderStatus === col.id).map(order => (
                <div key={order._id} className={`bg-card p-4 rounded-lg border-l-4 ${col.color} shadow-sm`}>
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-bold text-white">{order.orderNumber}</p>
                    <p className="text-xs text-muted">{new Date(order.createdAt).toLocaleTimeString()}</p>
                  </div>
                  <p className="text-sm text-primary font-bold mb-3">{order.orderType}</p>
                  
                  <ul className="text-sm text-gray-300 space-y-1 mb-4">
                    {order.items?.map((item, idx) => (
                      <li key={idx}><span className="font-bold text-white">{item.quantity}x</span> {item.productName} {item.size && `(${item.size})`}</li>
                    ))}
                  </ul>

                  {order.items?.some(i => i.instructions) && (
                    <div className="bg-red-500/10 border border-red-500/20 p-2 rounded mb-4 text-xs text-red-400">
                      <span className="font-bold">Note:</span> {order.items.find(i => i.instructions).instructions}
                    </div>
                  )}

                  <div className="flex gap-2">
                    {col.id === 'PENDING' && (
                      <button onClick={() => moveOrder(order._id, 'ACCEPTED')} className="w-full bg-blue-600 text-white py-1.5 rounded text-sm font-bold hover:bg-blue-700">Accept</button>
                    )}
                    {col.id === 'ACCEPTED' && (
                      <button onClick={() => moveOrder(order._id, 'PREPARING')} className="w-full bg-orange-600 text-white py-1.5 rounded text-sm font-bold hover:bg-orange-700">Start Preparing</button>
                    )}
                    {col.id === 'PREPARING' && (
                      <button onClick={() => moveOrder(order._id, 'READY')} className="w-full bg-green-600 text-white py-1.5 rounded text-sm font-bold hover:bg-green-700">Mark Ready</button>
                    )}
                    {col.id === 'READY' && order.orderType === 'DELIVERY' && (
                      <button onClick={() => moveOrder(order._id, 'OUT_FOR_DELIVERY')} className="w-full bg-purple-600 text-white py-1.5 rounded text-sm font-bold hover:bg-purple-700">Out for Delivery</button>
                    )}
                    {col.id === 'READY' && order.orderType === 'PICKUP' && (
                      <button onClick={() => moveOrder(order._id, 'DELIVERED')} className="w-full bg-gray-600 text-white py-1.5 rounded text-sm font-bold hover:bg-gray-700">Handed Over</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}