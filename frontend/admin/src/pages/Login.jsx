import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const res = await api.post('/auth/login', { email, password });
      const user = res.data.data.user;

      // FIX: Check if the user has an Admin role
      if (!['SUPER_ADMIN', 'BRANCH_MANAGER', 'FINANCE_MANAGER', 'KITCHEN_STAFF'].includes(user.role)) {
        await api.post('/auth/logout'); // Log them out immediately
        throw new Error('Access Denied: You do not have administrator permissions.');
      }

      nav('/dashboard');
    } catch (e) { 
      setError(e.response?.data?.message || e.message || 'Invalid email or password'); 
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <form onSubmit={submit} className="w-full max-w-sm space-y-4 bg-card p-8 rounded-2xl border border-border shadow-2xl">
        <h1 className="text-3xl font-black text-primary text-center mb-6">BLACK CAFE</h1>
        <p className="text-center text-muted text-sm -mt-4 mb-4">Admin Console</p>
        
        {error && <p className="text-red-500 text-center text-sm font-bold bg-red-500/10 p-2 rounded">{error}</p>}
        
        <div>
          <label className="text-xs text-muted mb-1 block">Email Address</label>
          <input 
            type="email"
            required
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            placeholder="admin@blackcafe.com" 
            className="w-full p-3 rounded-lg" 
          />
        </div>
        <div>
          <label className="text-xs text-muted mb-1 block">Password</label>
          <input 
            type="password" 
            required
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            placeholder="Admin@12345" 
            className="w-full p-3 rounded-lg" 
          />
        </div>
        
        <button disabled={loading} className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-primary-hover transition mt-4 disabled:opacity-50">
          {loading ? 'Logging in...' : 'Login to Admin'}
        </button>
      </form>
    </div>
  );
}