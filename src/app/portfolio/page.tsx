'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { X, ZoomIn, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface Item { id: string; title: string; category: string; location: string; image: string; slug: string; }

const FALLBACK: Item[] = [
  { id:'1',  category:'Weddings',  title:'Sarah & James',       location:'Nairobi',  image:'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80', slug:'sarah-james-wedding' },
  { id:'2',  category:'Corporate', title:'Safaricom Summit',    location:'Nairobi',  image:'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80', slug:'safaricom-summit-2024' },
  { id:'3',  category:'Drone',     title:'Nairobi Skyline',     location:'Nairobi',  image:'https://images.unsplash.com/photo-1508444845599-5c89863b1c44?w=600&q=80', slug:'nairobi-skyline-aerial' },
  { id:'4',  category:'Events',    title:'UN Climate Summit',   location:'Nairobi',  image:'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=600&q=80', slug:'un-climate-summit' },
  { id:'5',  category:'Weddings',  title:'Mary & Peter',        location:'Mombasa',  image:'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=600&q=80', slug:'mary-peter-wedding' },
  { id:'6',  category:'Branding',  title:'KCB Campaign',        location:'Nairobi',  image:'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&q=80', slug:'kcb-brand-campaign' },
  { id:'7',  category:'Corporate', title:'Equity Bank Gala',    location:'Nairobi',  image:'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&q=80', slug:'equity-bank-gala' },
  { id:'8',  category:'Drone',     title:'Rift Valley Survey',  location:'Nakuru',   image:'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800&q=80', slug:'rift-valley-survey' },
  { id:'9',  category:'Weddings',  title:'Anne & David',        location:'Karen',    image:'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&q=80', slug:'anne-david-wedding' },
  { id:'10', category:'Events',    title:'Tech Summit Kenya',   location:'Nairobi',  image:'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&q=80', slug:'tech-summit-kenya' },
  { id:'11', category:'Corporate', title:'Kenya Railways',      location:'Nairobi',  image:'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=600&q=80', slug:'kenya-railways-docs' },
  { id:'12', category:'Drone',     title:'Lake Naivasha',       location:'Naivasha', image:'https://images.unsplash.com/photo-1494783367193-149034c05e8f?w=800&q=80', slug:'lake-naivasha-aerial' },
  { id:'13', category:'Branding',  title:'Airtel Africa',       location:'Nairobi',  image:'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80', slug:'airtel-africa-campaign' },
  { id:'14', category:'Weddings',  title:'Lina & Sam',          location:'Diani',    image:'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=600&q=80', slug:'lina-sam-wedding' },
  { id:'15', category:'Events',    title:'Nairobi Fashion Week', location:'Nairobi', image:'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&q=80', slug:'nairobi-fashion-week' },
];

const CATS = ['All','Weddings','Corporate','Events','Drone','Branding'];
const PAGE_SIZE = 9;

/* Vary aspect ratios for masonry-like appearance */
function itemAspect(i: number) {
  if (i % 7 === 0) return 'aspect-[3/4]';
  if (i % 5 === 0) return 'aspect-[4/3]';
  return 'aspect-square';
}

/* ── Lightbox ───────────────────────────────────────────────────────── */
function Lightbox({ items, idx, onClose }: { items: Item[]; idx: number; onClose: () => void }) {
  const [cur, setCur] = useState(idx);
  const overlayRef = useRef<HTMLDivElement>(null);

  /* Keyboard navigation + focus trap */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape')      { onClose(); return; }
      if (e.key === 'ArrowRight')  setCur((i) => Math.min(i + 1, items.length - 1));
      if (e.key === 'ArrowLeft')   setCur((i) => Math.max(i - 1, 0));
      /* Tab focus trap */
      if (e.key === 'Tab') {
        const focusable = overlayRef.current?.querySelectorAll<HTMLElement>(
          'a[href],button:not([disabled]),[tabindex]:not([tabindex="-1"])'
        );
        if (!focusable || focusable.length === 0) return;
        const first = focusable[0];
        const last  = focusable[focusable.length - 1];
        if (e.shiftKey) { if (document.activeElement === first) { last.focus(); e.preventDefault(); } }
        else            { if (document.activeElement === last)  { first.focus(); e.preventDefault(); } }
      }
    };
    window.addEventListener('keydown', onKey);
    /* Move initial focus into the overlay */
    overlayRef.current?.querySelector<HTMLElement>('button')?.focus();
    return () => window.removeEventListener('keydown', onKey);
  }, [items.length, onClose]);

  const item = items[cur];
  return (
    <motion.div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label={`${item.title} — ${item.category}`}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/97 flex items-center justify-center"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.92 }} animate={{ scale: 1 }} exit={{ scale: 0.92 }}
        transition={{ ease: [0.16,1,0.3,1] }}
        className="relative max-w-5xl w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={item.image} alt={item.title} className="w-full max-h-[82vh] object-contain" />
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 flex items-end justify-between">
          <div>
            <div className="text-[11px] font-display tracking-widest text-[#E10600] uppercase mb-0.5">{item.category}</div>
            <div className="text-base font-heading text-white">{item.title}{item.location ? ` — ${item.location}` : ''}</div>
          </div>
          <div className="flex gap-2">
            <a href={item.image} target="_blank" rel="noopener noreferrer" aria-label="Open full image"
              className="w-9 h-9 border border-white/15 flex items-center justify-center text-white/50 hover:text-white transition-colors">
              <Download size={13} />
            </a>
            <Link href={`/portfolio/${item.slug}`} aria-label="View project details"
              className="w-9 h-9 border border-white/15 flex items-center justify-center text-white/50 hover:text-white transition-colors text-base">
              →
            </Link>
          </div>
        </div>
        <button onClick={onClose} aria-label="Close lightbox"
          className="absolute top-3 right-3 w-9 h-9 bg-black/70 flex items-center justify-center text-white hover:bg-[#E10600] transition-colors">
          <X size={16} />
        </button>
        {cur > 0 && (
          <button onClick={() => setCur(c => c - 1)} aria-label="Previous image"
            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/60 flex items-center justify-center text-white hover:bg-[#E10600] transition-colors">
            <ChevronLeft size={20} />
          </button>
        )}
        {cur < items.length - 1 && (
          <button onClick={() => setCur(c => c + 1)} aria-label="Next image"
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/60 flex items-center justify-center text-white hover:bg-[#E10600] transition-colors">
            <ChevronRight size={20} />
          </button>
        )}
      </motion.div>
    </motion.div>
  );
}

export default function PortfolioPage() {
  const [cat, setCat]       = useState('All');
  const [items, setItems]   = useState<Item[]>(FALLBACK);
  const [page, setPage]     = useState(1);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    (async () => {
      try {
        const sb = createClient();
        /* Field names match the schema: cover_image (not cover_image_url) */
        const { data } = await sb
          .from('mejasan_portfolio')
          .select('id,title,category,cover_image,slug')
          .eq('is_published', true)
          .order('sort_order')
          .order('created_at', { ascending: false });
        if (data?.length) {
          setItems(data.map(r => ({
            id: r.id,
            title: r.title,
            category: r.category.replace(/_/g,' ').replace(/\b\w/g,(c:string)=>c.toUpperCase()),
            location: '',
            image: r.cover_image ?? '',
            slug: r.slug ?? r.id,
          })));
        }
      } catch { /* use fallback */ }
    })();
  }, []);

  const filtered = cat === 'All' ? items : items.filter(i => i.category === cat);
  const visible  = filtered.slice(0, page * PAGE_SIZE);
  const hasMore  = visible.length < filtered.length;
  const loadMore = useCallback(() => setPage(p => p + 1), []);

  return (
    <div className="bg-[#0B0B0B] min-h-screen">
      {/* Header */}
      <div className="pt-32 pb-14 border-b border-white/[0.05]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16 text-center">
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="w-8 h-px bg-[#E10600]" />
            <span className="text-[11px] font-display font-semibold tracking-[0.3em] text-[#E10600] uppercase">Our Work</span>
            <div className="w-8 h-px bg-[#E10600]" />
          </div>
          <h1 className="text-[clamp(3rem,8vw,8rem)] font-heading font-light text-white leading-[0.92] mb-5">
            Our <em className="text-[#E10600] not-italic italic">Portfolio</em>
          </h1>
          <p className="text-base sm:text-lg text-white/55 max-w-xl mx-auto leading-relaxed">
            A curated selection of our finest work across weddings, corporate, events, aerial, and brand campaigns.
          </p>
        </div>
      </div>

      {/* Filter */}
      <div className="sticky top-[var(--navbar-height)] z-30 bg-[#0B0B0B]/95 backdrop-blur-xl border-b border-white/[0.05] py-4">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16 flex gap-2 overflow-x-auto scrollbar-none" role="tablist" aria-label="Filter portfolio by category">
          {CATS.map((c) => (
            <button key={c} role="tab" aria-selected={cat === c} onClick={() => { setCat(c); setPage(1); }}
              className={`shrink-0 px-4 py-2 text-[11px] font-display font-semibold tracking-widest uppercase transition-all ${cat===c ? 'bg-[#E10600] text-white' : 'text-white/45 border border-white/[0.1] hover:text-white hover:border-white/25'}`}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Grid — mixed aspect ratios for masonry feel */}
      <div ref={ref} className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16 py-10">
        <motion.div layout className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-0.5 items-start">
          <AnimatePresence>
            {visible.map((item, i) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity:0, scale:0.96 }}
                animate={inView?{opacity:1,scale:1}:{}}
                exit={{opacity:0}}
                transition={{duration:0.4,delay:i*0.03}}
                className={`relative overflow-hidden cursor-pointer group ${itemAspect(i)}`}
                onClick={() => setLightbox(i)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.image} alt={item.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-[#0B0B0B]/0 group-hover:bg-[#0B0B0B]/55 transition-all duration-300 flex items-center justify-center">
                  <ZoomIn size={20} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/80">
                  <div className="text-[10px] font-display tracking-widest text-[#E10600] uppercase">{item.category}</div>
                  <div className="text-sm font-heading text-white truncate">{item.title}</div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filtered.length === 0 && (
          <p className="text-center py-24 text-white/40 font-display text-sm">No items in this category yet.</p>
        )}

        {hasMore && (
          <div className="text-center mt-12">
            <button onClick={loadMore} className="btn-outline px-12">Load More</button>
          </div>
        )}
      </div>

      <AnimatePresence>
        {lightbox !== null && (
          <Lightbox items={visible} idx={lightbox} onClose={() => setLightbox(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
