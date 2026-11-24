'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function LoginPage() {
  const { login, register } = useAuth();
  const router = useRouter();
  
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        await register(formData);
      }
      router.push('/account');
    } catch (err) {
      // FIX: Parse the exact backend validation error
      const errorMsg = err.response?.data?.message || 'Authentication failed.';
      const errorDetails = err.response?.data?.details;
      
      if (errorDetails && Array.isArray(errorDetails)) {
        setError(`${errorMsg}: ${errorDetails.map(d => d.message).join(', ')}`);
      } else {
        setError(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    alert(`To enable real ${provider} login, you need to add ${provider} API keys to the backend.`);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-surface border border-border rounded-2xl shadow-2xl p-8">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-white mb-2">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-muted text-sm">
            {isLogin ? 'Sign in to track your orders.' : 'Join Black Cafe for exclusive VIP deals.'}
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 text-red-500 border border-red-500/20 p-3 rounded-lg mb-6 text-sm text-center font-bold">
            {error}
          </div>
        )}

        <div className="flex gap-3 mb-6">
          <button onClick={() => handleSocialLogin('Google')} className="flex-1 bg-white text-gray-800 font-bold py-2.5 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-100 transition">
            <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            Google
          </button>
          <button onClick={() => handleSocialLogin('Facebook')} className="flex-1 bg-[#1877F2] text-white font-bold py-2.5 rounded-lg flex items-center justify-center gap-2 hover:bg-[#166fe5] transition">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            Facebook
          </button>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px bg-border"></div>
          <span className="text-xs text-muted uppercase font-bold tracking-widest">Or use email</span>
          <div className="flex-1 h-px bg-border"></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <input required type="text" placeholder="Full Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-background text-white border border-border rounded-lg p-3 focus:ring-2 focus:ring-primary focus:outline-none" />
              <input required type="tel" placeholder="Phone Number" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-background text-white border border-border rounded-lg p-3 focus:ring-2 focus:ring-primary focus:outline-none" />
            </>
          )}
          <input required type="email" placeholder="Email Address" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-background text-white border border-border rounded-lg p-3 focus:ring-2 focus:ring-primary focus:outline-none" />
          <input required type="password" placeholder="Password (min 8 characters)" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full bg-background text-white border border-border rounded-lg p-3 focus:ring-2 focus:ring-primary focus:outline-none" />
          
          <button disabled={loading} type="submit" className="w-full bg-primary text-white font-bold text-lg py-3 rounded-lg hover:bg-primary-hover transition-colors shadow-md disabled:opacity-50 mt-2">
            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-muted text-sm">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button onClick={() => { setIsLogin(!isLogin); setError(null); }} className="text-primary font-bold hover:underline">
              {isLogin ? 'Register now' : 'Login here'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}