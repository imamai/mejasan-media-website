'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown } from 'lucide-react';
import Logo from '@/components/ui/Logo';

const NAV = [
  { label: 'About',    href: '/about' },
  {
    label: 'Services',
    href: '/services',
    children: [
      { label: 'Photography',  href: '/services/photography' },
      { label: 'Videography',  href: '/services/videography' },
      { label: 'Events',       href: '/services/events' },
      { label: 'Drone',        href: '/services/drone' },
      { label: 'Branding',     href: '/services/branding' },
    ],
  },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Blog',      href: '/blog' },
  { label: 'Contact',   href: '/contact' },
];

export default function Navbar() {
  const [scrolled,    setScrolled]    = useState(false);
  const [mobileOpen,  setMobileOpen]  = useState(false);
  const [dropdown,    setDropdown]    = useState<string | null>(null);
  const dropdownTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); setDropdown(null); }, [pathname]);

  const openDropdown  = (label: string) => {
    if (dropdownTimer.current) clearTimeout(dropdownTimer.current);
    setDropdown(label);
  };
  const closeDropdown = () => {
    dropdownTimer.current = setTimeout(() => setDropdown(null), 80);
  };

  /* Adaptive colours based on scroll position */
  const linkCls    = scrolled ? 'text-[#0F0F0F]/60 hover:text-[#0F0F0F]' : 'text-white/55 hover:text-white';
  const activeCls  = scrolled ? 'text-[#0F0F0F]' : 'text-white';
  const iconCls    = scrolled ? 'text-[#0F0F0F]/60 hover:text-[#0F0F0F]' : 'text-white/60 hover:text-white';
  const portalCls  = scrolled ? 'text-[#0F0F0F]/45 hover:text-[#0F0F0F]' : 'text-white/45 hover:text-white';

  const dropdownPanel = scrolled
    ? 'bg-white border border-[#0F0F0F]/[0.08] shadow-lg'
    : 'bg-[#141414] border border-white/[0.08]';
  const dropdownLink = scrolled
    ? 'text-[#0F0F0F]/55 hover:text-[#0F0F0F] hover:bg-[#0F0F0F]/[0.04]'
    : 'text-white/55 hover:text-white hover:bg-white/[0.04]';

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-xl border-b border-[#0F0F0F]/[0.07]'
            : 'bg-transparent'
        }`}
        style={{ height: 'var(--navbar-height)' }}
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16 h-full flex items-center justify-between">
          <Logo dark={scrolled} />

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-8">
            {NAV.map((item) =>
              item.children ? (
                <div key={item.label} className="relative">
                  <button
                    className={`flex items-center gap-1 text-[13px] font-display font-medium tracking-widest uppercase transition-colors ${linkCls}`}
                    onMouseEnter={() => openDropdown(item.label)}
                    onMouseLeave={closeDropdown}
                  >
                    {item.label} <ChevronDown size={11} />
                  </button>
                  <AnimatePresence>
                    {dropdown === item.label && (
                      <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 6 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full left-1/2 -translate-x-1/2 pt-2"
                        onMouseEnter={() => openDropdown(item.label)}
                        onMouseLeave={closeDropdown}
                      >
                        <div className={`${dropdownPanel} py-2 min-w-[190px]`}>
                          {item.children.map((c) => (
                            <Link
                              key={c.href}
                              href={c.href}
                              onClick={() => setDropdown(null)}
                              className={`block px-5 py-2.5 text-[12px] font-display tracking-widest uppercase transition-colors ${dropdownLink}`}
                            >
                              {c.label}
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-[13px] font-display font-medium tracking-widest uppercase transition-colors ${
                    pathname === item.href ? activeCls : linkCls
                  }`}
                >
                  {item.label}
                </Link>
              )
            )}
          </div>

          <div className="flex items-center gap-3">
            <Link href="/client-portal" className={`hidden lg:block text-[12px] font-display font-semibold tracking-widest uppercase transition-colors ${portalCls}`}>
              Client Portal
            </Link>
            <Link href="/booking" className="btn-primary hidden sm:inline-flex">
              Book Now
            </Link>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              className={`lg:hidden w-10 h-10 flex items-center justify-center transition-colors ${iconCls}`}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu — always dark overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-40 bg-[#0B0B0B] flex flex-col pt-[72px]"
          >
            <div className="flex-1 overflow-y-auto px-6 py-8 space-y-1">
              {NAV.map((item) => (
                <div key={item.label}>
                  <Link
                    href={item.href ?? '#'}
                    className={`block py-3 text-3xl font-heading font-light transition-colors ${
                      pathname === item.href ? 'text-[#E10600]' : 'text-white/75 hover:text-white'
                    }`}
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.label}
                  </Link>
                  {item.children && (
                    <div className="pl-4 space-y-0.5 pb-1">
                      {item.children.map((c) => (
                        <Link
                          key={c.href}
                          href={c.href}
                          onClick={() => setMobileOpen(false)}
                          className="block py-2 text-sm font-display text-white/45 hover:text-white transition-colors"
                        >
                          {c.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div className="pt-6 space-y-3">
                <Link href="/client-portal" onClick={() => setMobileOpen(false)} className="block py-3 text-xl font-heading font-light text-white/55 hover:text-white">
                  Client Portal
                </Link>
                <Link href="/booking" onClick={() => setMobileOpen(false)} className="btn-primary w-full justify-center mt-4">
                  Book a Consultation
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
