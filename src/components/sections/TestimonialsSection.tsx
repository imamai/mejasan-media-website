'use client';

import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  text: string;
  rating: number;
  img: string;
}

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} size={12} fill="#E10600" className="text-[#E10600]" />
      ))}
    </div>
  );
}

export default function TestimonialsSection({ testimonials }: { testimonials: Testimonial[] }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [idx, setIdx] = useState(0);

  if (testimonials.length === 0) return null;

  const prev = () => setIdx((i) => (i - 1 + testimonials.length) % testimonials.length);
  const next = () => setIdx((i) => (i + 1) % testimonials.length);
  const t = testimonials[idx];

  return (
    <section ref={ref} className="bg-[#F5F5F0] py-24 md:py-32">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-14"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-px bg-[#E10600]" />
            <span className="text-[11px] font-display font-semibold tracking-[0.3em] text-[#E10600] uppercase">Client Stories</span>
          </div>
          <h2 className="text-[clamp(2rem,4.5vw,4.5rem)] font-heading font-light text-[#0F0F0F] leading-[1.0]">
            What Our Clients Say
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Featured testimonial */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.4 }}
              >
                <Quote size={36} className="text-[#E10600]/25 mb-6" />
                <blockquote className="text-[clamp(1.1rem,2vw,1.5rem)] font-heading font-light text-[#0F0F0F]/80 leading-relaxed mb-8">
                  &ldquo;{t.text}&rdquo;
                </blockquote>
                <Stars count={t.rating} />
                <div className="flex items-center gap-4 mt-6">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={t.img} alt={t.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="font-display font-semibold text-[#0F0F0F] text-sm">{t.name}</div>
                    <div className="text-[12px] text-[#0F0F0F]/45 font-display">{t.role}</div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Controls */}
            <div className="flex items-center gap-3 mt-10">
              <button
                onClick={prev}
                aria-label="Previous testimonial"
                className="w-10 h-10 border border-[#0F0F0F]/[0.12] flex items-center justify-center text-[#0F0F0F]/40 hover:text-[#0F0F0F] hover:border-[#0F0F0F]/25 transition-all"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={next}
                aria-label="Next testimonial"
                className="w-10 h-10 border border-[#0F0F0F]/[0.12] flex items-center justify-center text-[#0F0F0F]/40 hover:text-[#0F0F0F] hover:border-[#0F0F0F]/25 transition-all"
              >
                <ChevronRight size={16} />
              </button>
              <div className="flex gap-1.5 ml-2">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setIdx(i)}
                    aria-label={`Go to testimonial ${i + 1}`}
                    className={`h-1.5 rounded-full transition-all ${i === idx ? 'bg-[#E10600] w-5' : 'w-1.5 bg-[#0F0F0F]/20 hover:bg-[#0F0F0F]/35'}`}
                  />
                ))}
              </div>
            </div>
          </motion.div>

          {/* Card grid */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-0.5"
          >
            {testimonials.map((item, i) => (
              <button
                key={item.id}
                onClick={() => setIdx(i)}
                className={`text-left p-5 sm:p-6 border transition-all duration-200 ${
                  i === idx
                    ? 'border-[#E10600]/30 bg-white shadow-sm'
                    : 'border-[#0F0F0F]/[0.07] bg-white hover:border-[#0F0F0F]/14 hover:shadow-sm'
                }`}
              >
                <Stars count={item.rating} />
                <p className="text-[13px] text-[#0F0F0F]/55 mt-3 mb-4 line-clamp-3 leading-relaxed">{item.text}</p>
                <div className="flex items-center gap-2.5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.img} alt={item.name} className="w-7 h-7 rounded-full object-cover shrink-0" />
                  <div>
                    <div className="text-[12px] font-display font-semibold text-[#0F0F0F]">{item.name}</div>
                    <div className="text-[11px] text-[#0F0F0F]/40 font-display">{item.role}</div>
                  </div>
                </div>
              </button>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
