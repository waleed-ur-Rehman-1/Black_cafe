import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import api from '../services/api';

export default function ProtectedRoute({ children }) {
  const [state, setState] = useState('loading');

  useEffect(() => {
    api.get('/auth/me')
      .then(r => {
        const user = r.data.data.user;
        // FIX: Check if the user has an Admin role
        if (user && ['SUPER_ADMIN', 'BRANCH_MANAGER', 'FINANCE_MANAGER', 'KITCHEN_STAFF'].includes(user.role)) {
          setState('ok');
        } else {
          setState('denied');
        }
      })
      .catch(() => setState('denied'));
  }, []);

  if (state === 'loading') return <div className="p-12 text-center text-muted">Loading...</div>;
  if (state === 'denied') return <Navigate to="/login" replace />;
  
  return children;
}