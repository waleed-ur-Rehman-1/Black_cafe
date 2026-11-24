import { useEffect, useState } from 'react';
import api from '../services/api';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '', slug: '', description: '', categoryId: '', basePrice: '', images: '', isVIP: false
  });

  const loadData = async () => {
    try {
      const [prodRes, catRes] = await Promise.all([
        api.get('/products'),
        api.get('/categories') 
      ]);
      setProducts(prodRes.data.data || []);
      setCategories(catRes.data.data || []);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { loadData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.categoryId) return alert("Please select a category!");
    
    try {
      const payload = {
        name: formData.name,
        slug: formData.name.toLowerCase().replace(/ /g, '-'),
        description: formData.description,
        categoryId: formData.categoryId,
        basePrice: Number(formData.basePrice) * 100, // Convert PKR to Paisa
        images: [formData.images],
        isVIP: formData.isVIP
      };
      
      await api.post('/products/admin', payload); 
      setIsModalOpen(false);
      setFormData({ name: '', slug: '', description: '', categoryId: '', basePrice: '', images: '', isVIP: false });
      loadData();
      alert("Product created successfully! Check the customer site.");
    } catch (err) { 
      alert(err.response?.data?.message || 'Error creating product. Check console.'); 
      console.error(err);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Products Management</h1>
        <button onClick={() => setIsModalOpen(true)} className="bg-primary text-white px-5 py-2.5 rounded-lg font-bold hover:bg-primary-hover transition">
          + Add Product
        </button>
      </div>

      <div className="bg-card rounded-xl shadow-lg border border-border overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-surface border-b border-border text-muted">
            <tr>
              <th className="p-4 font-semibold">Product Name</th>
              <th className="p-4 font-semibold">Price (PKR)</th>
              <th className="p-4 font-semibold">VIP Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {products.map(p => (
              <tr key={p._id} className="hover:bg-surface/50 transition-colors">
                <td className="p-4 font-medium text-white">{p.name}</td>
                <td className="p-4 text-muted">{(p.basePrice / 100).toLocaleString()}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${p.isVIP ? 'bg-primary/20 text-primary' : 'bg-surface text-muted'}`}>
                    {p.isVIP ? 'VIP' : 'Standard'}
                  </span>
                </td>
              </tr>
            ))}
            {products.length === 0 && <tr><td colSpan="3" className="p-8 text-center text-muted">No products found.</td></tr>}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold text-white mb-6">Add New Product</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input required placeholder="Product Name" value={formData.name} className="w-full p-3 rounded-lg" onChange={e => setFormData({...formData, name: e.target.value})} />
              <textarea required placeholder="Description" value={formData.description} className="w-full p-3 rounded-lg" onChange={e => setFormData({...formData, description: e.target.value})} />
              
              <select required value={formData.categoryId} className="w-full p-3 rounded-lg" onChange={e => setFormData({...formData, categoryId: e.target.value})}>
                <option value="">Select Category...</option>
                {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>

              <div className="grid grid-cols-2 gap-4">
                <input required type="number" placeholder="Price (PKR)" value={formData.basePrice} className="w-full p-3 rounded-lg" onChange={e => setFormData({...formData, basePrice: e.target.value})} />
                <input required placeholder="Image URL (https://...)" value={formData.images} className="w-full p-3 rounded-lg" onChange={e => setFormData({...formData, images: e.target.value})} />
              </div>
              
              <label className="flex items-center gap-3 p-3 bg-surface border border-border rounded-lg cursor-pointer mt-2">
                <input type="checkbox" checked={formData.isVIP} className="w-5 h-5 accent-primary" onChange={e => setFormData({...formData, isVIP: e.target.checked})} />
                <span className="text-sm font-bold text-white">Mark as VIP Item</span>
              </label>

              <div className="flex gap-3 pt-6 border-t border-border mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 bg-surface rounded-lg font-bold text-white hover:bg-gray-700 transition">Cancel</button>
                <button type="submit" className="flex-1 py-3 bg-primary text-white rounded-lg font-bold hover:bg-primary-hover transition shadow-md">Save Product</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}