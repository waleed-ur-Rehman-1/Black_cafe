import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="w-full bg-[#050505] border-t border-border mt-auto">
      <div className="max-w-[1200px] mx-auto px-2 py-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          
          {/* Column 1: Brand & Socials */}
          <div className="flex flex-col gap-5">
            <Link href="/" className="flex items-center">
              <Image 
                src="/logo.png" 
                alt="Black Cafe Logo" 
                width={112} 
                height={80} 
                className="object-contain" 
                priority
              />
            </Link>
            <p className="text-sm text-muted leading-relaxed max-w-xs">
              Where we fuse exceptional hygiene, quality, and hearty servings in each offering.
            </p>
            <div className="flex flex-col gap-2 mt-2">
              <span className="text-white font-semibold text-sm">Follow Us:</span>
              <div className="flex gap-3">
                <a href="#" className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center text-white hover:opacity-80 transition">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/></svg>
                </a>
                <a href="#" className="w-8 h-8 rounded bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 flex items-center justify-center text-white hover:opacity-80 transition">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                </a>
                <a href="#" className="w-8 h-8 rounded bg-black border border-gray-700 flex items-center justify-center text-white hover:opacity-80 transition">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Contact */}
          <div className="flex flex-col gap-4">
            <h4 className="text-white font-bold text-lg mb-2">Contact Us</h4>
            <div className="flex items-center gap-3 text-sm text-gray-300">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-white text-sm">call</span>
              </div>
              <span>03710900074</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-300">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-white text-sm">Email</span>
              </div>
              <span>blackcafe@vincrms.com</span>
            </div>
            <div className="flex items-start gap-3 text-sm text-gray-300">
              <div className="w-30 h-10 rounded-full bg-primary flex items-center justify-center shrink-0 mt-0.5">
                <span className="material-symbols-outlined text-white text-sm">Place</span>
              </div>
              <span>Ring road main kabootar chowk peshawar</span>
            </div>
          </div>

          {/* Column 3: Quick Links */}
          <div className="flex flex-col gap-3">
            <h4 className="text-white font-bold text-lg mb-2">Quick Links</h4>
            <Link href="/about" className="text-sm text-gray-300 hover:text-primary transition">About Us</Link>
            <Link href="/privacy" className="text-sm text-gray-300 hover:text-primary transition">Privacy Policy</Link>
            <Link href="/terms" className="text-sm text-gray-300 hover:text-primary transition">Terms & Conditions</Link>
          </div>

          {/* Column 4: Opening Hours */}
          <div className="flex flex-col gap-3">
            <h4 className="text-white font-bold text-lg mb-2">Opening Hours</h4>
            <p className="text-sm text-gray-300">
              Monday to Sunday 11:00 AM - 02:45 AM
            </p>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-6 border-t border-primary/20 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} BLACK CAFE. All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  );
}