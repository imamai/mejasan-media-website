'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import type { HomeContent } from '@/lib/page-content-schema';

/* First item gets the large bento-grid cell; the rest are regular cells. */
const SPANS = ['col-span-2 row-span-2', '', '', '', ''];

export default function FeaturedWork({ content }: { content: HomeContent['featuredWork'] }) {
  const { eyebrow, heading, items } = content;
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
              <span className="text-[11px] font-display font-semibold tracking-[0.3em] text-[#E10600] uppercase">{eyebrow}</span>
            </div>
            <h2 className="text-[clamp(2rem,4.5vw,4.5rem)] font-heading font-light text-white leading-[1.0]">
              {heading}
            </h2>
          </div>
          <Link href="/portfolio" className="btn-outline shrink-0 group">
            Full Portfolio <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </motion.div>

        {/* Mobile: simple 1-col stack. Desktop: asymmetric bento grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0.5 lg:auto-rows-[300px]">
          {items.map(({ category, title, location, img, imgPosition, slug }, i) => {
            const span = SPANS[i] ?? '';
            return (
              <motion.div
                key={title}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.7, delay: i * 0.08 }}
                /* On mobile every card is full-width 220px tall; on desktop apply span */
                className={`h-[220px] sm:h-full ${span ? `lg:${span}` : ''}`}
              >
                <Link href={`/portfolio/${slug}`} className="group relative block w-full h-full overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img} alt={`${title} — ${category}`}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    style={{ objectPosition: imgPosition }}
                  />
                  <div className="absolute inset-0 bg-[#0B0B0B]/0 group-hover:bg-[#0B0B0B]/45 transition-colors duration-300" />
                  {/* Always-visible label on mobile, hover-reveal on desktop */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 sm:translate-y-2 sm:opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="text-[10px] font-display tracking-widest text-[#E10600] uppercase mb-0.5">{category}</div>
                    <div className="text-sm font-heading text-white">{title} — {location}</div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
