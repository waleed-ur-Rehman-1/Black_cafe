import ProductCard from '@/components/ProductCard';

export const metadata = {
  title: 'VIP Selection — Black Cafe',
  description: 'Exclusive premium items curated by Black Cafe.',
};

async function getVIP() {
  try {
    const r = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'}/products/vip`,
      { cache: 'no-store' }
    );
    const json = await r.json();
    return json.data || [];
  } catch {
    return [];
  }
}

export default async function VIPPage() {
  const items = await getVIP();

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-8">
        <p className="text-accent text-sm uppercase tracking-widest">Curated</p>
        <h1 className="text-4xl font-bold mt-2">
          <span className="text-accent">VIP</span> Selection
        </h1>
        <p className="text-muted mt-2 max-w-xl">
          Our finest dishes, hand-selected by the chef. Limited availability.
        </p>
      </div>

      {items.length === 0 ? (
        <p className="text-muted">
          No VIP items available yet. Ask an admin to seed the menu.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}