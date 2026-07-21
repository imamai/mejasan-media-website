'use client';

import { useRef, useState, useEffect } from 'react';
import { useInView } from 'framer-motion';
import type { HomeContent } from '@/lib/page-content-schema';

function Counter({ value, suffix, active }: { value: number; suffix: string; active: boolean }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    let cur = 0;
    const step = value / 60;
    const id = setInterval(() => {
      cur += step;
      if (cur >= value) { setCount(value); clearInterval(id); }
      else setCount(Math.floor(cur));
    }, 16);
    return () => clearInterval(id);
  }, [active, value]);
  return <>{count}{suffix}</>;
}

export default function StatsSection({ content }: { content: HomeContent['statsSection'] }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="red-band bg-[#E10600] py-16 sm:py-20">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
          {content.items.map(({ value, suffix, label, desc }) => (
            <div key={label} className="text-center">
              <div className="text-[clamp(2.5rem,5vw,5rem)] font-heading font-light text-white leading-none mb-2">
                <Counter value={Number(value) || 0} suffix={suffix} active={inView} />
              </div>
              <div className="text-sm font-display font-semibold text-white mb-1">{label}</div>
              <div className="text-[11px] text-white/60 leading-relaxed hidden sm:block">{desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
