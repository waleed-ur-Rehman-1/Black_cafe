import { useEffect, useState } from 'react';
import api from '../services/api';

export default function Refunds() {
  const [refunds, setRefunds] = useState([]);
  useEffect(() => { api.get('/refunds').then(r => setRefunds(r.data.data || [])).catch(() => {}); }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Refund Requests</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {refunds.map(r => (
          <div key={r._id} className="bg-card border border-border p-5 rounded-xl shadow-lg">
            <div className="flex justify-between items-start mb-2">
              <p className="font-bold text-white">{r.refundReference}</p>
              <span className={`px-2 py-1 rounded text-xs font-bold ${
                r.status === 'REFUNDED' ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'
              }`}>{r.status}</span>
            </div>
            <p className="text-sm text-muted mb-4">{r.reason}</p>
            <p className="text-lg font-black text-primary">PKR {(r.amount / 100).toLocaleString()}</p>
          </div>
        ))}
        {refunds.length === 0 && <p className="text-muted col-span-2">No refunds requested.</p>}
      </div>
    </div>
  );
}