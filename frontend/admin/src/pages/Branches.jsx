import { useEffect, useState } from 'react';
import api from '../services/api';

export default function Branches() {
  const [branches, setBranches] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '', branchCode: '', address: '', phone: '', email: '', lat: '', lng: '', deliveryRadius: 5, deliveryFee: 150
  });

  const loadBranches = () => {
    api.get('/branches').then(res => setBranches(res.data.data || []));
  };

  useEffect(() => { loadBranches(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const lat = Number(formData.lat);
      const lng = Number(formData.lng);

      // Extra safety check before sending to backend
      if (lat < -90 || lat > 90) {
        return alert("Latitude must be between -90 and 90. (Peshawar is approx 34.01)");
      }
      if (lng < -180 || lng > 180) {
        return alert("Longitude must be between -180 and 180. (Peshawar is approx 71.52)");
      }

      const payload = {
        name: formData.name,
        branchCode: formData.branchCode,
        address: formData.address,
        phone: formData.phone || undefined,
        email: formData.email || undefined,
        location: { 
          type: 'Point', 
          coordinates: [lng, lat] // MongoDB uses [Longitude, Latitude]
        },
        deliveryRadius: Number(formData.deliveryRadius) || 5,
        deliveryFee: (Number(formData.deliveryFee) || 0) * 100
      };
      
      await api.post('/branches/admin', payload);
      setIsModalOpen(false);
      
      // Reset form
      setFormData({ name: '', branchCode: '', address: '', phone: '', email: '', lat: '', lng: '', deliveryRadius: 5, deliveryFee: 150 });
      
      loadBranches();
      alert("Branch created successfully!");
    } catch (err) { 
      alert(err.response?.data?.message || 'Error creating branch. Check console.');
      console.error(err);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Branch Management</h1>
        <button onClick={() => setIsModalOpen(true)} className="bg-primary text-white px-5 py-2.5 rounded-lg font-bold hover:bg-primary-hover transition">
          + Add Branch
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {branches.map(b => (
          <div key={b._id} className="bg-card p-6 rounded-xl border border-border shadow-lg">
            <h3 className="font-bold text-lg text-white">{b.name}</h3>
            <p className="text-sm text-muted mt-1">{b.address}</p>
            
            <div className="mt-4 pt-4 border-t border-border text-sm space-y-1">
              {b.phone && <p className="text-white"><span className="text-muted">Phone:</span> {b.phone}</p>}
              {b.email && <p className="text-white"><span className="text-muted">Email:</span> {b.email}</p>}
              <p className="flex justify-between mt-2"><span className="text-muted">Code:</span> <span className="font-bold text-white">{b.branchCode}</span></p>
              <p className="flex justify-between"><span className="text-muted">Delivery Fee:</span> <span className="font-bold text-white">Rs. {b.deliveryFee / 100}</span></p>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-white mb-6">Add New Branch</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input required placeholder="Branch Name" value={formData.name} className="w-full p-3 rounded-lg" onChange={e => setFormData({...formData, name: e.target.value})} />
              <input required placeholder="Branch Code (e.g. KHI-01)" value={formData.branchCode} className="w-full p-3 rounded-lg" onChange={e => setFormData({...formData, branchCode: e.target.value})} />
              <input required placeholder="Full Address" value={formData.address} className="w-full p-3 rounded-lg" onChange={e => setFormData({...formData, address: e.target.value})} />
              
              <div className="grid grid-cols-2 gap-3">
                <input required placeholder="Phone Number" value={formData.phone} className="w-full p-3 rounded-lg" onChange={e => setFormData({...formData, phone: e.target.value})} />
                <input type="email" placeholder="Email Address" value={formData.email} className="w-full p-3 rounded-lg" onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>

              {/* FIXED: Added bounds to Lat/Lng inputs */}
              <div className="grid grid-cols-2 gap-3">
                <input 
                  required 
                  type="number" 
                  step="any"
                  min="-90"
                  max="90"
                  placeholder="Latitude (34.01)" 
                  value={formData.lat} 
                  className="w-full p-3 rounded-lg" 
                  onChange={e => setFormData({...formData, lat: e.target.value})} 
                />
                <input 
                  required 
                  type="number" 
                  step="any"
                  min="-180"
                  max="180"
                  placeholder="Longitude (71.52)" 
                  value={formData.lng} 
                  className="w-full p-3 rounded-lg" 
                  onChange={e => setFormData({...formData, lng: e.target.value})} 
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <input required type="number" min="0" placeholder="Radius (km)" value={formData.deliveryRadius} className="w-full p-3 rounded-lg" onChange={e => setFormData({...formData, deliveryRadius: e.target.value})} />
                <input required type="number" min="0" placeholder="Fee (PKR)" value={formData.deliveryFee} className="w-full p-3 rounded-lg" onChange={e => setFormData({...formData, deliveryFee: e.target.value})} />
              </div>

              <div className="flex gap-3 pt-6 border-t border-border mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 bg-surface rounded-lg font-bold text-white hover:bg-gray-700 transition">Cancel</button>
                <button type="submit" className="flex-1 py-3 bg-primary text-white rounded-lg font-bold hover:bg-primary-hover transition shadow-md">Save Branch</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}