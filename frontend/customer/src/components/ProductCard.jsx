'use client';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const basePrice = product.variantIds?.[0]?.price ?? product.basePrice ?? 0;
  
  const handleQuickAdd = (e) => {
    e.preventDefault();
    if (product.variantIds && product.variantIds.length > 1) {
      window.location.href = `/product/${product._id}`;
      return;
    }
    addItem({
      productId: product._id,
      name: product.name,
      unitPrice: basePrice,
      quantity: 1,
      variantId: product.variantIds?.[0]?._id,
      addonIds: [],
      image: product.images?.[0]
    });
  };

  return (
    <Link href={`/product/${product._id}`} className="group bg-surface border border-border rounded-xl overflow-hidden hover:border-primary/50 transition-all flex flex-col shadow-lg">
      <div className="relative aspect-square overflow-hidden bg-background">
        {product.images?.[0] ? (
          <img 
            src={product.images[0]} 
            alt={product.name} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80';
              e.target.onerror = null; 
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted text-6xl">🍽️</div>
        )}
        
        {product.isVIP && (
          <span className="absolute top-3 left-3 bg-primary text-white text-xs font-bold px-2.5 py-1 rounded-md shadow-sm">
            VIP
          </span>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1">
        {/* FIX: Changed 'truncate' to 'line-clamp-2' and added min-height so cards stay uniform */}
        <h3 className="font-bold text-lg text-white line-clamp-2 leading-snug min-h-[3.5rem]">{product.name}</h3>
        
        <p className="text-muted text-sm mt-1 mb-3 line-clamp-2 flex-1">{product.description || 'Delicious item from Black Cafe'}</p>
        
        <div className="mt-auto flex items-center justify-between">
          <span className="text-white font-extrabold text-lg">
            Rs. {(basePrice / 100).toLocaleString()}
          </span>
          <button 
            onClick={handleQuickAdd} 
            className="bg-primary text-white font-bold px-4 py-2 rounded-lg text-sm hover:bg-primary-hover transition-colors shadow-sm"
          >
            Add
          </button>
        </div>
      </div>
    </Link>
  );
}