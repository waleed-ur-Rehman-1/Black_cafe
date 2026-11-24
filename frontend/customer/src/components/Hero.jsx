import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
      <video
        className="absolute inset-0 w-full h-full object-cover opacity-50"
        autoPlay muted loop playsInline
        poster="https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1600"
      >
        <source src="https://cdn.coverr.co/videos/coverr-a-cafe-with-people-1573/1080p.mp4" type="video/mp4" />
      </video>
      <div className="relative z-10 text-center px-4">
        <h1 className="text-5xl md:text-7xl font-bold text-white">Black Cafe</h1>
        <p className="mt-4 text-muted text-lg max-w-xl mx-auto">
          Premium flavours. Live-tracked delivery. Curated VIP selections.
        </p>
        <div className="mt-8 flex gap-4 justify-center">
          <Link href="/menu" className="px-6 py-3 bg-accent text-black font-semibold rounded-lg">Order Now</Link>
          <Link href="/vip" className="px-6 py-3 border border-accent text-accent rounded-lg">Explore VIP</Link>
        </div>
      </div>
    </section>
  );
}