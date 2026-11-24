'use client';
import { createContext, useContext, useEffect, useState } from 'react';

const Ctx = createContext(null);
export const useCart = () => useContext(Ctx);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('blackcafe_cart');
    if (saved) {
      try { setItems(JSON.parse(saved)); } catch (e) {}
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem('blackcafe_cart', JSON.stringify(items));
  }, [items]);

  const addItem = (newItem) => {
    setItems(prev => {
      // Create a unique key based on product, variant, addons, AND instructions
      const key = `${newItem.productId}-${newItem.variantId || 'default'}-${(newItem.addonIds || []).sort().join(',')}-${newItem.instructions || ''}`;
      const existing = prev.find(p => p._key === key);
      
      if (existing) {
        return prev.map(p => p._key === key ? { ...p, quantity: p.quantity + newItem.quantity } : p);
      }
      return [...prev, { ...newItem, _key: key }];
    });
  };

  const removeItem = (key) => setItems(prev => prev.filter(i => i._key !== key));
  
  const updateQty = (key, qty) => {
    if (qty <= 0) return removeItem(key);
    setItems(prev => prev.map(i => i._key === key ? { ...i, quantity: qty } : i));
  };
  
  const clear = () => setItems([]);
  
  const total = items.reduce((s, i) => s + (i.unitPrice || 0) * i.quantity, 0);

  return (
    <Ctx.Provider value={{ items, addItem, removeItem, updateQty, clear, total }}>
      {children}
    </Ctx.Provider>
  );
}