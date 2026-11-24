'use client';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

export default function CartPage() {
  const { items, updateQty, removeItem, total } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-32 text-center">
        <span className="material-symbols-outlined text-6xl text-muted mb-4">shopping_cart</span>
        <h1 className="text-3xl font-bold text-text mb-2">Your cart is empty</h1>
        <p className="text-muted mb-8">Looks like you haven't added anything yet.</p>
        <Link href="/menu" className="inline-block px-8 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary-hover transition shadow-md">
          Browse Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Your Order</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items List */}
        <div className="flex-1 space-y-4">
          {items.map(i => (
            <div key={i._key} className="bg-surface border border-border rounded-xl p-4 flex gap-4 shadow-sm">
              {i.image && (
                <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100 shrink-0 border border-border">
                  <img src={i.image} alt={i.name} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="flex-1 flex flex-col">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-text text-lg">{i.name}</h3>
                    {i.variantName && <p className="text-sm text-primary font-medium">{i.variantName}</p>}
                    {i.addonNames?.length > 0 && (
                      <p className="text-xs text-muted mt-1">+ {i.addonNames.join(', ')}</p>
                    )}
                    {i.instructions && (
                      <p className="text-xs text-orange-600 mt-1 italic">Note: {i.instructions}</p>
                    )}
                  </div>
                  <span className="font-bold text-text">
                    Rs. {((i.unitPrice * i.quantity) / 100).toLocaleString()}
                  </span>
                </div>
                
                <div className="mt-auto pt-4 flex items-center justify-between">
                  <div className="flex items-center bg-background border border-border rounded-lg">
                    <button onClick={() => updateQty(i._key, i.quantity - 1)} className="px-3 py-1 text-muted hover:text-text">-</button>
                    <span className="px-3 text-text text-sm font-bold">{i.quantity}</span>
                    <button onClick={() => updateQty(i._key, i.quantity + 1)} className="px-3 py-1 text-muted hover:text-text">+</button>
                  </div>
                  <button onClick={() => removeItem(i._key)} className="text-red-500 text-sm font-semibold hover:underline">Remove</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-80 shrink-0">
          <div className="bg-surface border border-border rounded-xl p-6 sticky top-24 shadow-sm">
            <h2 className="text-lg font-bold text-text mb-4">Summary</h2>
            
            <div className="space-y-3 mb-6 text-sm">
              <div className="flex justify-between text-muted">
                <span>Subtotal</span>
                <span className="text-text font-medium">Rs. {(total / 100).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-muted">
                <span>Delivery</span>
                <span className="text-text font-medium">Calculated next</span>
              </div>
            </div>
            
            <div className="border-t border-border pt-4 mb-6 flex justify-between items-center">
              <span className="font-bold text-text">Total</span>
              <span className="font-bold text-primary text-xl">Rs. {(total / 100).toLocaleString()}</span>
            </div>
            
            <Link href="/checkout" className="block w-full py-3.5 bg-primary text-white text-center font-bold rounded-lg hover:bg-primary-hover transition shadow-md">
              Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}