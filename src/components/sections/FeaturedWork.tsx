'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const WORK = [
  { id: '1', cat: 'Weddings',  title: 'Sarah & James',     loc: 'Nairobi',  img: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80',  span: 'col-span-2 row-span-2' },
  { id: '2', cat: 'Corporate', title: 'Safaricom Summit',  loc: 'Nairobi',  img: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80',  span: '' },
  { id: '3', cat: 'Drone',     title: 'Nairobi Skyline',   loc: 'Nairobi',  img: 'https://images.unsplash.com/photo-1508444845599-5c89863b1c44?w=600&q=80',  span: '' },
  { id: '4', cat: 'Events',    title: 'UN Climate Summit', loc: 'Nairobi',  img: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=600&q=80',  span: '' },
  { id: '5', cat: 'Branding',  title: 'Equity Bank',       loc: 'Nairobi',  img: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&q=80',      span: '' },
];

export default function FeaturedWork() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} className="bg-[#141414] py-24 md:py-32">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10"
        >
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-px bg-[#E10600]" />
              <span className="text-[11px] font-display font-semibold tracking-[0.3em] text-[#E10600] uppercase">Selected Work</span>
            </div>
            <h2 className="text-[clamp(2rem,4.5vw,4.5rem)] font-heading font-light text-white leading-[1.0]">
              Stories We&apos;ve Told
            </h2>
          </div>
          <Link href="/portfolio" className="btn-outline shrink-0 group">
            Full Portfolio <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </motion.div>

        {/* Mobile: simple 1-col stack. Desktop: asymmetric bento grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0.5 lg:auto-rows-[300px]">
          {WORK.map(({ id, cat, title, loc, img, span }, i) => (
            <motion.div
              key={id}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.7, delay: i * 0.08 }}
              /* On mobile every card is full-width 220px tall; on desktop apply span */
              className={`h-[220px] sm:h-full ${span ? `lg:${span}` : ''}`}
            >
              <Link href={`/portfolio/${id}`} className="group relative block w-full h-full overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img} alt={`${title} — ${cat}`}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-[#0B0B0B]/0 group-hover:bg-[#0B0B0B]/45 transition-colors duration-300" />
                {/* Always-visible label on mobile, hover-reveal on desktop */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 sm:translate-y-2 sm:opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="text-[10px] font-display tracking-widest text-[#E10600] uppercase mb-0.5">{cat}</div>
                  <div className="text-sm font-heading text-white">{title} — {loc}</div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
