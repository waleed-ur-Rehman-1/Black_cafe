'use client';
import { useEffect, useState } from 'react';
import { useBranch } from '@/context/BranchContext';
import api from '@/lib/api';

export default function BranchesPage() {
  const { branch, select } = useBranch();
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch all active branches
    api.get('/branches')
      .then(res => setBranches(res.data.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-20 text-muted">Loading branches...</div>;

  return (
    <div className="max-w-[1000px] mx-auto px-4 py-12">
      <h1 className="font-serif text-4xl text-white mb-2">Select a Branch</h1>
      <p className="text-muted mb-8">Choose your nearest Black Cafe location for accurate menu availability.</p>

      <div className="grid md:grid-cols-3 gap-6">
        {branches.map(b => {
          const isSelected = branch?._id === b._id;
          return (
            <div 
              key={b._id} 
              className={`bg-card border rounded-xl p-6 flex flex-col justify-between transition-all ${isSelected ? 'border-primary ring-2 ring-primary/20' : 'border-border hover:border-primary/50'}`}
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-white">{b.name}</h3>
                  {isSelected && <span className="material-symbols-outlined text-primary">check_circle</span>}
                </div>
                <p className="text-sm text-muted flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined text-[18px]">location_on</span> {b.address}
                </p>
                <p className="text-sm text-muted flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined text-[18px]">call</span> {b.phone}
                </p>
                <p className="text-sm text-muted flex items-center gap-2 mb-4">
                  <span className="material-symbols-outlined text-[18px]">schedule</span> {b.openingHours?.open} - {b.openingHours?.close}
                </p>
              </div>
              <button
                onClick={() => select(b)}
                className={`w-full py-2.5 rounded-lg font-semibold text-sm transition-all ${
                  isSelected 
                    ? 'bg-primary text-black cursor-default' 
                    : 'bg-surface text-white hover:bg-primary hover:text-black'
                }`}
              >
                {isSelected ? 'Selected Branch' : 'Select This Branch'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}