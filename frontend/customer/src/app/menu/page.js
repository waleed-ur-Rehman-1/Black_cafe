'use client';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import ProductCard from '@/components/ProductCard';

function MenuContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialCategory = searchParams.get('category') || 'all';

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, prodRes] = await Promise.all([
          api.get('/categories'),
          api.get('/products?limit=1000') // Force fetch all products
        ]);
        setCategories(catRes.data.data || []);
        setProducts(prodRes.data.data || []);
      } catch (err) {
        console.error("Failed to load menu data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCategoryChange = (slug) => {
    setSelectedCategory(slug);
    if (slug === 'all') router.push('/menu');
    else router.push(`/menu?category=${slug}`);
  };

  // Filter perfectly by converting ObjectIds to Strings
  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(p => {
        const cat = categories.find(c => c.slug === selectedCategory);
        return cat && String(p.categoryId) === String(cat._id);
      });

  if (loading) return <div className="text-center py-32 text-muted">Loading menu...</div>;

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-12">
      <div className="mb-10 text-center">
        <h1 className="text-4xl md:text-5xl font-black text-white mb-4">Our Menu</h1>
        <p className="text-muted text-lg">Choose from our freshly prepared favourites.</p>
      </div>

      {/* CATEGORY TABS */}
      <div className="sticky top-[72px] z-40 bg-background/95 backdrop-blur-md py-4 mb-8 -mx-4 px-4 border-b border-border">
        <div className="flex overflow-x-auto gap-3 pb-2 snap-x scrollbar-hide">
          <button
            onClick={() => handleCategoryChange('all')}
            className={`shrink-0 px-6 py-2.5 rounded-full font-bold text-sm transition-all snap-start ${
              selectedCategory === 'all' ? 'bg-primary text-white shadow-md' : 'bg-surface text-muted hover:text-white border border-border'
            }`}
          >
            All Items
          </button>
          
          {categories.map(cat => (
            <button
              key={cat._id}
              onClick={() => handleCategoryChange(cat.slug)}
              className={`shrink-0 px-6 py-2.5 rounded-full font-bold text-sm transition-all snap-start ${
                selectedCategory === cat.slug ? 'bg-primary text-white shadow-md' : 'bg-surface text-muted hover:text-white border border-border'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* PRODUCT GRID */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-20">
          <span className="material-symbols-outlined text-6xl text-muted mb-4">fastfood</span>
          <h2 className="text-xl font-bold text-white mb-2">No items found</h2>
          <p className="text-muted">We couldn't find any products in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function MenuPage() {
  return (
    <Suspense fallback={<div className="text-center py-32 text-muted">Loading...</div>}>
      <MenuContent />
    </Suspense>
  );
}