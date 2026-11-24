'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useBranch } from '@/context/BranchContext';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

const LINKS = [
  { href: '/menu', label: 'Menu', icon: 'restaurant_menu' },
  { href: '/vip', label: 'VIP', icon: 'workspace_premium' },
  { href: '/gallery', label: 'Gallery', icon: 'photo_library' },
];

export default function Navbar() {
  const { branch, detect, loading } = useBranch();
  const { items } = useCart();
  const { user } = useAuth();
  const pathname = usePathname();

  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  const cartCount = items.reduce((s, i) => s + i.quantity, 0);
  const branchLabel = loading
    ? 'Locating...'
    : branch
    ? branch.name.split('—')[1]?.trim() || branch.name
    : 'Set Location';

  // Glass effect once the page scrolls
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on navigation
  useEffect(() => setOpen(false), [pathname]);

  const isActive = (href) => pathname === href || pathname?.startsWith(href + '/');

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 border-b border-border transition-all duration-300 ${
        scrolled
          ? 'bg-black/75 backdrop-blur-xl shadow-lg shadow-black/40'
          : 'bg-surface shadow-md'
      }`}
    >
      {/* Accent line */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />

      <div
        className={`max-w-[1200px] mx-auto px-4 flex items-center justify-between gap-4 transition-all duration-300 ${
          scrolled ? 'h-[64px]' : 'h-[72px]'
        }`}
      >
        {/* Logo */}
        <Link
          href="/"
          aria-label="Black Cafe home"
          className="group relative flex items-center shrink-0 rounded-xl px-2.5 py-1.5 ring-1 ring-white/10 bg-white/5 hover:ring-primary transition-all duration-300"
        >
          <span className="pointer-events-none absolute inset-0 rounded-xl bg-primary opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-25" />
          <Image
            src="/logo.png"
            alt="Black Cafe"
            width={160}
            height={48}
            priority
            className="relative h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105 drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]"
          />
        </Link>

        {/* Desktop links */}
        <nav className="hidden lg:flex items-center gap-1 ml-6 text-sm font-semibold">
          {LINKS.map(({ href, label }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                className={`relative px-4 py-2 rounded-full transition-colors duration-200
                  after:absolute after:left-1/2 after:-translate-x-1/2 after:bottom-1 after:h-[2px] after:rounded-full after:bg-primary after:transition-all after:duration-300
                  ${
                    active
                      ? 'text-white bg-white/10 after:w-5'
                      : 'text-white/70 hover:text-white hover:bg-white/5 after:w-0 hover:after:w-5'
                  }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="flex-1" />

        {/* Right side */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Branch selector */}
          <button
            onClick={detect}
            disabled={loading}
            className="hidden md:flex items-center gap-1.5 pl-2 pr-3.5 py-1.5 rounded-full bg-background border border-border hover:border-primary transition-all text-sm font-semibold disabled:opacity-50"
          >
            <span
              className={`material-symbols-outlined text-primary text-[18px] ${
                loading ? 'animate-pulse' : ''
              }`}
            >
              location_on
            </span>
            <span className="truncate max-w-[110px] text-white">{branchLabel}</span>
          </button>

          {/* Cart */}
          <Link
            href="/cart"
            aria-label={`Cart, ${cartCount} items`}
            className="relative flex items-center gap-2 bg-gradient-to-br from-primary to-primary-hover text-white pl-4 pr-3 py-2.5 rounded-full font-bold shadow-lg shadow-black/40 hover:scale-105 active:scale-95 transition-transform duration-200"
          >
            <span className="material-symbols-outlined text-[20px]">shopping_cart</span>
            <span className="grid place-items-center min-w-[22px] h-[22px] px-1.5 rounded-full bg-white text-black text-xs font-extrabold">
              {cartCount}
            </span>
          </Link>

          {/* Auth */}
          <div className="hidden sm:block pl-3 ml-1 border-l border-border">
            {user ? (
              <Link
                href="/account"
                className="flex items-center gap-2 text-sm font-bold text-white hover:text-primary transition"
              >
                <span className="grid place-items-center w-9 h-9 rounded-full bg-background border border-border">
                  <span className="material-symbols-outlined text-[20px]">person</span>
                </span>
                <span className="hidden xl:block">Account</span>
              </Link>
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 bg-white/5 border border-border text-white px-4 py-2 rounded-full text-sm font-bold hover:border-primary hover:bg-white/10 transition"
              >
                <span className="material-symbols-outlined text-[18px]">login</span>
                Login
              </Link>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
            aria-expanded={open}
            className="lg:hidden grid place-items-center w-10 h-10 rounded-full bg-background border border-border hover:border-primary text-white transition"
          >
            <span className="material-symbols-outlined text-[22px]">
              {open ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`lg:hidden grid transition-all duration-300 ease-out ${
          open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <div className="px-4 pb-5 pt-2 flex flex-col gap-1 border-t border-border bg-surface">
            {LINKS.map(({ href, label, icon }) => (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition ${
                  isActive(href)
                    ? 'bg-white/10 text-white'
                    : 'text-white/80 hover:bg-white/5'
                }`}
              >
                <span className="material-symbols-outlined text-primary text-[22px]">{icon}</span>
                {label}
              </Link>
            ))}

            <div className="mt-3 pt-3 border-t border-border flex flex-col gap-2 sm:hidden">
              <button
                onClick={detect}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-3 rounded-xl bg-background border border-border text-white font-semibold disabled:opacity-50 md:hidden"
              >
                <span className="material-symbols-outlined text-primary text-[20px]">location_on</span>
                {branchLabel}
              </button>
              <Link
                href={user ? '/account' : '/login'}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/5 border border-border text-white font-bold"
              >
                <span className="material-symbols-outlined text-[20px]">
                  {user ? 'person' : 'login'}
                </span>
                {user ? 'Account' : 'Login'}
              </Link>
            </div>

            <button
              onClick={detect}
              disabled={loading}
              className="hidden sm:flex md:hidden items-center gap-2 mt-3 px-4 py-3 rounded-xl bg-background border border-border text-white font-semibold disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-primary text-[20px]">location_on</span>
              {branchLabel}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}