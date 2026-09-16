import React, { useState, useEffect } from 'react';
import { ShoppingBag, Search, User, Menu, X, Sliders } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Navbar({ onNavigate, activeRoute, activeSection }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { totalItemsCount, setIsCartOpen } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Shop', path: 'shop' },
    { label: 'Collections', path: 'collections' },
    { label: 'Spaces', path: 'spaces' },
    { label: 'Journal', path: 'journal' },
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-50 px-4 md:px-8 pt-4 pb-2 pointer-events-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between pointer-events-auto transition-all duration-500">
        
        {/* LEFT: Logo */}
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center justify-center bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-ivory-300 shadow-sm hover:scale-105 transition-all duration-300"
          title="DecorAura Home"
        >
          <img
            src="/images/decoraura-logo.png"
            alt="DecorAura"
            className="h-11 sm:h-12 md:h-14 w-auto object-contain block opacity-100 filter-none"
          />
        </button>

        {/* CENTER: Floating Pill Navigation */}
        <nav className={`hidden md:flex items-center gap-1 px-3 py-1.5 rounded-full glass-pill transition-all duration-500 ${isScrolled ? 'scale-95 py-1 px-2' : ''}`}>
          {navLinks.map((link) => {
            const isActive = activeRoute === 'home' || activeRoute === 'inspiration'
              ? activeSection === link.path
              : activeRoute === link.path;

            return (
              <button
                key={link.path}
                onClick={() => onNavigate(link.path)}
                className={`px-4 py-1.5 text-xs font-sans font-medium uppercase tracking-widest rounded-full transition-all duration-300 ${
                  isActive
                    ? 'bg-charcoal-900 text-white shadow-sm'
                    : 'text-charcoal-700 hover:text-bronze-600 hover:bg-ivory-200/50'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* RIGHT: Actions (Search, Cart, Admin) */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('shop')}
            className="p-2.5 rounded-full bg-ivory-50/80 backdrop-blur-md border border-ivory-300/50 text-charcoal-800 hover:bg-ivory-200 transition-all duration-300"
            aria-label="Search"
          >
            <Search size={18} />
          </button>

          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2.5 rounded-full bg-ivory-50/80 backdrop-blur-md border border-ivory-300/50 text-charcoal-800 hover:bg-ivory-200 transition-all duration-300"
            aria-label="Shopping Bag"
          >
            <ShoppingBag size={18} />
            {totalItemsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-bronze-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
                {totalItemsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => onNavigate('admin')}
            className="p-2.5 rounded-full bg-ivory-50/80 backdrop-blur-md border border-ivory-300/50 text-charcoal-800 hover:bg-ivory-200 transition-all duration-300 hidden sm:flex items-center gap-1.5 text-xs font-medium px-3"
            title="Admin Studio"
          >
            <Sliders size={16} />
            <span className="hidden lg:inline">Admin</span>
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2.5 rounded-full bg-ivory-50/80 backdrop-blur-md border border-ivory-300/50 text-charcoal-800"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden pointer-events-auto mt-2 p-4 rounded-2xl glass-pill flex flex-col gap-2 border border-ivory-300 shadow-xl">
          {navLinks.map((link) => (
            <button
              key={link.path}
              onClick={() => {
                onNavigate(link.path);
                setMobileMenuOpen(false);
              }}
              className="text-left px-4 py-2 text-sm font-sans font-medium uppercase tracking-widest text-charcoal-800 hover:text-bronze-500"
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={() => {
              onNavigate('admin');
              setMobileMenuOpen(false);
            }}
            className="text-left px-4 py-2 text-sm font-sans font-medium uppercase tracking-widest text-bronze-600 flex items-center gap-2 border-t border-ivory-300/60 pt-3"
          >
            <Sliders size={16} /> Admin Studio
          </button>
        </div>
      )}
    </header>
  );
}
