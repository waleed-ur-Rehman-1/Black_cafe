'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useCart } from '@/context/CartContext';

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { addItem } = useCart();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [instructions, setInstructions] = useState('');

  useEffect(() => {
    api.get(`/products/${id}`)
      .then(res => {
        const data = res.data.data;
        setProduct(data);
        if (data.variantIds && data.variantIds.length > 0) {
          setSelectedVariant(data.variantIds[0]);
        }
      })
      .catch(err => setProduct(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="text-center py-32 text-muted">Loading...</div>;
  if (!product) return <div className="text-center py-32 text-white text-xl font-bold">Product not found</div>;

  const basePrice = selectedVariant ? selectedVariant.price : (product.basePrice || 0);
  const addonsPrice = (selectedAddons || []).reduce((sum, addon) => sum + addon.price, 0);
  const totalPrice = (basePrice + addonsPrice) * quantity;

  const toggleAddon = (addon) => {
    if (selectedAddons.find(a => a._id === addon._id)) {
      setSelectedAddons(selectedAddons.filter(a => a._id !== addon._id));
    } else {
      setSelectedAddons([...selectedAddons, addon]);
    }
  };

  const handleAddToCart = () => {
    addItem({
      productId: product._id,
      name: product.name,
      unitPrice: basePrice + addonsPrice,
      quantity,
      variantId: selectedVariant?._id,
      variantName: selectedVariant?.name,
      addonIds: selectedAddons.map(a => a._id),
      addonNames: selectedAddons.map(a => a.name),
      instructions,
      image: product.images?.[0]
    });
    router.push('/cart');
  };

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-12">
      <div className="grid md:grid-cols-2 gap-10">
        
        <div className="space-y-4">
          <div className="aspect-square rounded-2xl overflow-hidden bg-surface border border-border">
            {product.images?.[0] ? (
              <img 
                src={product.images[0]} 
                alt={product.name} 
                className="w-full h-full object-cover" 
                // FIX: Add onError fallback
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80';
                  e.target.onerror = null; 
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted text-6xl">🍽️</div>
            )}
          </div>
        </div>

        <div className="flex flex-col">
          <div className="mb-6 border-b border-border pb-6">
            <div className="flex items-center gap-2 mb-2">
               {product.isVIP && <span className="bg-primary text-black text-xs font-bold px-2 py-1 rounded">VIP</span>}
               <span className="text-muted text-sm uppercase tracking-wider">{product.preparationTime} mins prep</span>
            </div>
            <h1 className="font-serif text-4xl text-white mb-2">{product.name}</h1>
            <p className="text-muted text-lg leading-relaxed">{product.description || 'Delicious item from Black Cafe'}</p>
          </div>

          {product.variantIds && product.variantIds.length > 0 && (
            <div className="mb-8">
              <h3 className="text-white font-semibold mb-3">Select Size</h3>
              <div className="grid grid-cols-2 gap-3">
                {product.variantIds.map(v => (
                  <button
                    key={v._id}
                    onClick={() => setSelectedVariant(v)}
                    className={`p-3 rounded-lg border text-left flex justify-between items-center transition-all ${
                      selectedVariant?._id === v._id ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <span className="font-medium text-white">{v.name}</span>
                    <span className="text-primary font-bold">PKR {(v.price / 100).toLocaleString()}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.addonIds && product.addonIds.length > 0 && (
            <div className="mb-8">
              <h3 className="text-white font-semibold mb-3">Extra Add-ons</h3>
              <div className="space-y-2">
                {product.addonIds.map(addon => {
                  const isSelected = selectedAddons.find(a => a._id === addon._id);
                  return (
                    <label key={addon._id} className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-surface cursor-pointer transition-colors">
                      <div className="flex items-center gap-3">
                        <input type="checkbox" checked={!!isSelected} onChange={() => toggleAddon(addon)} className="w-5 h-5 accent-primary" />
                        <span className="text-white">{addon.name}</span>
                      </div>
                      <span className="text-muted">+ PKR {(addon.price / 100).toLocaleString()}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          <div className="mb-8">
            <h3 className="text-white font-semibold mb-3">Special Instructions</h3>
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="E.g., No onions, extra spicy..."
              className="w-full bg-surface border border-border rounded-lg p-3 text-white focus:border-primary outline-none resize-none"
              rows={2}
            />
          </div>

          <div className="mt-auto pt-6 border-t border-border">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center bg-surface border border-border rounded-lg">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-2 text-muted hover:text-white">-</button>
                <span className="px-4 text-white font-bold">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="px-4 py-2 text-muted hover:text-white">+</button>
              </div>
              <button onClick={handleAddToCart} className="flex-1 bg-primary text-white font-bold uppercase tracking-wider py-3.5 rounded-lg hover:bg-primary-hover transition-colors flex justify-between px-6">
                <span>Add to Cart</span>
                <span>PKR {(totalPrice / 100).toLocaleString()}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}