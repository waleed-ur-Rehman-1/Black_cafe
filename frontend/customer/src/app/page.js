import Link from 'next/link';
import ProductCard from '@/components/ProductCard';

async function getData() {
  try {
    const [vipRes, menuRes, catRes] = await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/vip`, { cache: 'no-store' }),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, { cache: 'no-store' }),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`, { cache: 'no-store' })
    ]);
    
    const vip = (await vipRes.json()).data || [];
    const menu = (await menuRes.json()).data || [];
    const categories = (await catRes.json()).data || [];
    
    return { vip, menu, categories };
  } catch {
    return { vip: [], menu: [], categories: [] };
  }
}

const categoryIcons = {
  'pizzas': '🍕', 'burgers': '🍔', 'wings': '🍗', 'sides': '🍟', 'beverages': '🥤', 'drinks': '🥤', 'desserts': '🍰', 'shakes': '🥤', 'coffee-tea': '☕'
};

export default async function Home() {
  const { vip, menu, categories } = await getData();
  const bestSellers = menu.slice(0, 8);
  const topDeals = vip.slice(0, 4);

  return (
    <div className="flex flex-col w-full pb-20">
      
      {/* HERO SECTION */}
      <section className="relative w-full h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden bg-black">
        <video autoPlay loop muted playsInline poster="https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=2000&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover opacity-60">
          <source src="/hero.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-black/40 to-black/60"></div>

        <div className="relative z-20 text-center px-4 max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight drop-shadow-lg">
            Craving Something <span className="text-primary italic">Delicious?</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-8 font-medium">
            Fresh, fast, and delivered hot. Choose from our premium menu.
          </p>
          <Link href="/menu" className="inline-block bg-primary text-white font-bold text-lg px-8 py-4 rounded-full hover:bg-primary-hover transition-transform hover:scale-105 shadow-xl">
            Order Now
          </Link>
        </div>
      </section>

      {/* EXPLORE CATEGORIES */}
      <section className="py-12 max-w-[1200px] mx-auto px-4 w-full">
        <div className="flex justify-between items-end mb-6">
          <h2 className="text-2xl font-bold text-white">Explore Categories</h2>
          <Link href="/menu" className="text-primary font-semibold text-sm hover:underline">View Menu</Link>
        </div>
        <div className="flex overflow-x-auto gap-4 pb-4 snap-x scrollbar-hide">
          {categories.map((cat) => (
            <Link 
              key={cat._id} 
              href={`/menu?category=${cat.slug}`} 
              className="flex flex-col items-center justify-center shrink-0 w-[100px] h-[100px] bg-surface border border-border rounded-xl hover:border-primary transition-all group snap-start"
            >
              <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">
                {categoryIcons[cat.slug.toLowerCase()] || '🍽️'}
              </span>
              <span className="font-semibold text-xs text-gray-300 truncate w-full text-center px-1">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* BEST SELLERS */}
      <section className="py-8 max-w-[1200px] mx-auto px-4 w-full">
        <div className="flex justify-between items-end mb-6">
          <h2 className="text-2xl font-bold text-white">Popular Right Now</h2>
          <Link href="/menu" className="text-primary font-semibold text-sm hover:underline">View All</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestSellers.map(product => <ProductCard key={product._id} product={product} />)}
        </div>
      </section>

      {/* TOP DEALS */}
      {topDeals.length > 0 && (
        <section className="py-8 max-w-[1200px] mx-auto px-4 w-full">
          <div className="flex justify-between items-end mb-6">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold text-white">Exclusive VIP Deals</h2>
              <span className="bg-primary/20 text-primary text-xs font-bold px-2 py-1 rounded-md">Premium</span>
            </div>
            <Link href="/vip" className="text-primary font-semibold text-sm hover:underline">View VIP Menu</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {topDeals.map(product => <ProductCard key={product._id} product={product} />)}
          </div>
        </section>
      )}

      {/* DYNAMIC CATEGORY SECTIONS (Only show top 3 to keep homepage clean) */}
      {categories.slice(0, 3).map((cat) => {
        const catProducts = menu.filter(p => String(p.categoryId) === String(cat._id)).slice(0, 4);
        if (catProducts.length === 0) return null;

        return (
          <section key={cat._id} className="py-8 max-w-[1200px] mx-auto px-4 w-full border-t border-border/50">
            <div className="flex justify-between items-end mb-6 mt-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{categoryIcons[cat.slug.toLowerCase()] || '🍽️'}</span>
                <h2 className="text-2xl font-bold text-white">{cat.name}</h2>
              </div>
              <Link href={`/menu?category=${cat.slug}`} className="text-primary font-semibold text-sm hover:underline">
                View All {cat.name}
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {catProducts.map(product => <ProductCard key={product._id} product={product} />)}
            </div>
          </section>
        );
      })}

      {/* BOTTOM CTA */}
      <section className="py-16 mt-8 text-center bg-surface border-y border-border">
        <h2 className="text-3xl font-bold text-white mb-4">Hungry for more?</h2>
        <p className="text-muted mb-8 max-w-md mx-auto">Explore our full menu to see all our delicious offerings, sides, and drinks.</p>
        <Link href="/menu" className="inline-block bg-primary text-white font-bold px-10 py-4 rounded-full hover:bg-primary-hover transition-transform hover:scale-105 shadow-xl">
          Browse Full Menu
        </Link>
      </section>
    </div>
  );
}