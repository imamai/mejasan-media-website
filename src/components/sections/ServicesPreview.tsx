'use client';

import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Camera, Video, Aperture, Wind, Layers, ArrowRight } from 'lucide-react';

const SERVICES = [
  {
    icon: Camera,
    label: 'Photography',
    href: '/services/photography',
    desc: 'Wedding, corporate, product & studio photography that tells your story with technical mastery.',
    img: 'https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=600&q=80',
  },
  {
    icon: Video,
    label: 'Videography',
    href: '/services/videography',
    desc: 'Wedding films, corporate videos, documentaries & commercial production with cinematic precision.',
    img: 'https://images.unsplash.com/photo-1585647347384-2593bc35786b?w=600&q=80',
  },
  {
    icon: Aperture,
    label: 'Event Coverage',
    href: '/services/events',
    desc: 'Conferences, launches, awards & concerts — live documentation at the highest professional standard.',
    img: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80',
  },
  {
    icon: Wind,
    label: 'Drone Services',
    href: '/services/drone',
    desc: 'KCAA-licensed aerial photography, videography, mapping & site documentation across East Africa.',
    img: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=600&q=80',
  },
  {
    icon: Layers,
    label: 'Brand & Content',
    href: '/services/branding',
    desc: 'Social media content, brand storytelling & campaign production that builds lasting presence.',
    img: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&q=80',
  },
];

export default function ServicesPreview() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} className="bg-white py-24 md:py-32">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14"
        >
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-px bg-[#E10600]" />
              <span className="text-[11px] font-display font-semibold tracking-[0.3em] text-[#E10600] uppercase">What We Do</span>
            </div>
            <h2 className="text-[clamp(2rem,4.5vw,4.5rem)] font-heading font-light text-[#0F0F0F] leading-[1.0]">
              Full-Service<br />Media Production
            </h2>
          </div>
          <Link href="/services" className="btn-outline-dark shrink-0 group">
            All Services <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-0.5">
          {SERVICES.map(({ icon: Icon, label, href, desc, img }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link href={href} className="group block overflow-hidden bg-[#F5F5F0] hover:bg-white hover:shadow-md transition-all duration-300">
                {/* Full-brightness image */}
                <div className="relative overflow-hidden h-52 sm:h-56">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img}
                    alt={label}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                {/* Light content area */}
                <div className="p-6">
                  <div className="w-9 h-9 bg-[#E10600]/10 flex items-center justify-center mb-3 group-hover:bg-[#E10600] transition-colors duration-300">
                    <Icon size={16} className="text-[#E10600] group-hover:text-white transition-colors duration-300" />
                  </div>
                  <div className="text-[10px] font-display font-semibold tracking-[0.3em] text-[#E10600] uppercase mb-1.5">{label}</div>
                  <p className="text-[13px] text-[#0F0F0F]/55 leading-relaxed line-clamp-3">{desc}</p>
                  <div className="mt-3 flex items-center gap-2 text-[11px] font-display tracking-widest uppercase text-[#0F0F0F]/30 group-hover:text-[#E10600] transition-colors">
                    Explore <ArrowRight size={10} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
