'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import api from '@/lib/api';

const Ctx = createContext(null);
export const useBranch = () => useContext(Ctx);

export function BranchProvider({ children }) {
  const [branch, setBranch] = useState(null);
  const [alternatives, setAlternatives] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const detect = () => {
    setLoading(true);
    setError(null);
    
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser. Please select a branch manually.');
      setLoading(false);
      return;
    }

    // This triggers the browser popup asking for GPS permission
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const r = await api.post('/branches/nearest', {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            orderType: 'DELIVERY',
          });
          
          const nearestBranch = r.data.data.branch;
          setBranch(nearestBranch);
          setAlternatives(r.data.data.alternatives || []);
          
          // Save to local storage so next time they don't have to wait
          localStorage.setItem('blackcafe_branch', JSON.stringify(nearestBranch));
        } catch (e) {
          setError(e.response?.data?.message || 'No branch available for your location.');
        } finally {
          setLoading(false);
        }
      }, 
      (err) => {
        console.warn("Location access denied or failed:", err);
        setError('Location permission denied. Please select a branch manually.');
        setLoading(false);
      },
      { timeout: 10000, enableHighAccuracy: true } // Forces accurate GPS
    );
  };

  const select = (branchData) => {
    setBranch(branchData);
    localStorage.setItem('blackcafe_branch', JSON.stringify(branchData));
    setError(null);
  };

  // Run on initial load
  useEffect(() => {
    const init = async () => {
      const saved = localStorage.getItem('blackcafe_branch');
      
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          // Verify the saved branch still exists in DB
          const res = await api.get(`/branches/${parsed._id}`);
          setBranch(res.data.data);
          setLoading(false);
        } catch (err) {
          // If it was deleted from DB, clear cache and detect again
          localStorage.removeItem('blackcafe_branch');
          detect();
        }
      } else {
        // If no saved branch, instantly ask for location
        detect();
      }
    };
    init();
  }, []);

  return (
    <Ctx.Provider value={{ branch, alternatives, error, detect, select, loading }}>
      {children}
    </Ctx.Provider>
  );
}