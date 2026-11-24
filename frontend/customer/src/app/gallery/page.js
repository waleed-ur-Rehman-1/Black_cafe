'use client';
import { useState } from 'react';
import Link from 'next/link';

const galleryItems = [
  { id: 1, type: 'image', url: '/gallery/1.jpg', caption: 'The Signature Smash', span: 'md:col-span-2 md:row-span-2' }, // Large featured
  { id: 2, type: 'image', url: '/gallery/9.jpg', caption: 'Stone Oven Pizza', span: 'md:col-span-1 md:row-span-2' }, // Tall
  { id: 3, type: 'image', url: '/gallery/11.jpg', caption: 'Crispy Hot Wings', span: 'md:col-span-1 md:row-span-1' }, // Normal
  { id: 4, type: 'image', url: '/gallery/5.jpg', caption: 'Thick Freak Shakes', span: 'md:col-span-1 md:row-span-1' }, // Normal
  { id: 5, type: 'video', url: '/gallery/12.mp4', caption: 'The Perfect Espresso', span: 'md:col-span-2 md:row-span-1' }, // Wide Video
  { id: 6, type: 'image', url: '/gallery/6.jpg', caption: 'BBQ Platters', span: 'md:col-span-1 md:row-span-1' },
  { id: 7, type: 'image', url: '/gallery/a.jpg', caption: 'Chocolate Decadence', span: 'md:col-span-1 md:row-span-1' },
];

export default function GalleryPage() {
  const [activeItem, setActiveItem] = useState(null);

  return (
    <div className="flex flex-col w-full pb-20 bg-background">
      
      {/* 1. CINEMATIC HERO SECTION */}
      <section className="relative w-full py-24 md:py-32 flex items-center justify-center overflow-hidden bg-black">
        <video 
          autoPlay loop muted playsInline 
          className="absolute inset-0 w-full h-full object-cover opacity-40 scale-105"
        >
          {/* Using your custom video for the background too! */}
          <source src="/gallery/12.mp4" type="video/mp4" />
        </video>
        
        {/* Gradient to blend the video into the black background */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-black/60 to-background"></div>
        
        {/* Text Container - Perfectly sized and centered */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto flex flex-col items-center justify-center">
          <span className="text-primary tracking-[0.3em] uppercase text-xs md:text-sm font-bold mb-4 block">
            The Visual Experience
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 drop-shadow-2xl leading-tight">
            A Feast for the Eyes
          </h1>
          <p className="text-base md:text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Step inside Black Cafe. Explore the craft, the ambiance, and the mouth-watering dishes that keep Peshawar coming back.
          </p>
        </div>
      </section>

      {/* 2. BENTO BOX GALLERY GRID */}
      <section className="max-w-[1400px] mx-auto px-4 py-16 w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 auto-rows-[250px]">
          
          {galleryItems.map((item) => (
            <div 
              key={item.id} 
              onClick={() => setActiveItem(item)}
              className={`group relative rounded-2xl overflow-hidden cursor-pointer bg-surface border border-border ${item.span}`}
            >
              {item.type === 'video' ? (
                <div className="w-full h-full relative">
                  <video 
                    src={item.url} autoPlay muted loop playsInline 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out" 
                  />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center group-hover:bg-black/40 transition-all">
                    <span className="material-symbols-outlined text-white text-5xl opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all">play_circle</span>
                  </div>
                </div>
              ) : (
                <img 
                  src={item.url} alt={item.caption} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out" 
                />
              )}
              
              {/* Premium Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                <span className="text-primary text-xs font-bold uppercase tracking-wider mb-1">Black Cafe</span>
                <p className="text-white font-bold text-xl">{item.caption}</p>
              </div>
            </div>
          ))}

          {/* CTA Bento Box */}
          <div className="group relative rounded-2xl overflow-hidden bg-primary flex flex-col items-center justify-center p-6 text-center md:col-span-1 md:row-span-1 shadow-[0_0_30px_rgba(228,0,43,0.3)]">
            <h3 className="text-2xl font-black text-white mb-2">Hungry Yet?</h3>
            <p className="text-white/80 text-sm mb-4">Taste what you see.</p>
            <Link href="/menu" className="bg-white text-black font-bold px-6 py-2 rounded-full hover:scale-105 transition-transform">
              Order Now
            </Link>
          </div>

        </div>
      </section>

      {/* 3. INSTAGRAM SECTION */}
      <section className="max-w-[1200px] mx-auto px-4 py-12 w-full text-center">
        <div className="flex flex-col items-center justify-center mb-10">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 p-[3px] mb-4 shadow-xl">
            <div className="w-full h-full bg-surface rounded-3xl flex items-center justify-center">
              <span className="text-3xl">📸</span>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Tag us in your moments</h2>
          <p className="text-muted mb-6">Follow <strong className="text-white">@blackcafepeshawar</strong> for daily updates.</p>
          
          <a 
            href="https://www.instagram.com/blackcafepeshawar/?hl=en" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold px-8 py-3.5 rounded-full hover:shadow-[0_0_20px_rgba(236,72,153,0.5)] hover:scale-105 transition-all"
          >
            Follow on Instagram
          </a>
        </div>

        {/* Instagram Feed Mockup - Using 4 of your images */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['/gallery/1.jpg', '/gallery/11.jpg', '/gallery/5.jpg', '/gallery/6.jpg'].map((imgUrl, i) => (
            <a 
              key={i} 
              href="https://www.instagram.com/blackcafepeshawar/?hl=en" 
              target="_blank" 
              rel="noopener noreferrer"
              className="relative aspect-square rounded-xl overflow-hidden group border border-border"
            >
              <img 
                src={imgUrl} 
                alt="Instagram Post" 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                <span className="text-3xl">❤️</span>
                <span className="text-white font-bold text-sm">View Post</span>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* 4. LIGHTBOX MODAL */}
      {activeItem && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 transition-all" onClick={() => setActiveItem(null)}>
          <div className="relative max-w-6xl w-full max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <button 
              onClick={() => setActiveItem(null)}
              className="absolute -top-14 right-0 text-white hover:text-primary transition-colors bg-white/10 hover:bg-white/20 p-2 rounded-full"
            >
              <span className="material-symbols-outlined text-3xl">close</span>
            </button>
            
            {activeItem.type === 'video' ? (
              <video 
                src={activeItem.url} controls autoPlay 
                className="w-full h-auto max-h-[85vh] rounded-2xl shadow-2xl border border-border" 
              />
            ) : (
              <img 
                src={activeItem.url} alt={activeItem.caption} 
                className="w-full h-auto max-h-[85vh] object-contain rounded-2xl shadow-2xl border border-border" 
              />
            )}
            
            <div className="text-center mt-6">
              <p className="text-primary font-bold tracking-widest uppercase text-sm mb-1">Black Cafe Peshawar</p>
              <p className="text-white font-bold text-2xl">{activeItem.caption}</p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}