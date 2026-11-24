import { useEffect, useState } from 'react';
import api from '../services/api';

export default function Payments() {
  const [payments, setPayments] = useState([]);
  
  useEffect(() => { 
    api.get('/payments/admin/list').then(r => setPayments(r.data.data || [])).catch(() => {}); 
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Transactions</h1>
      
      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-lg">
        <table className="w-full text-left text-sm">
          <thead className="bg-surface border-b border-border text-muted">
            <tr>
              <th className="p-4 font-semibold">Reference</th>
              <th className="p-4 font-semibold">Method</th>
              <th className="p-4 font-semibold">Amount</th>
              <th className="p-4 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border text-white">
            {payments.map(p => (
              <tr key={p._id} className="hover:bg-surface/50 transition-colors">
                <td className="p-4 font-mono text-xs text-muted">{p.transactionReference}</td>
                <td className="p-4 font-bold text-white">{p.method}</td>
                <td className="p-4 text-white">PKR {(p.amount / 100).toLocaleString()}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    p.status === 'SUCCESS' ? 'bg-green-500/20 text-green-500' : 
                    p.status === 'INITIATED' ? 'bg-yellow-500/20 text-yellow-500' : 
                    'bg-red-500/20 text-red-500'
                  }`}>
                    {p.status}
                  </span>
                </td>
              </tr>
            ))}
            {payments.length === 0 && (
              <tr>
                <td colSpan="4" className="p-8 text-center text-muted">No payments recorded.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}