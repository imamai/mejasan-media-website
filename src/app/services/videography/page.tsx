'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Check, Play, X, MessageCircle } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const TYPES = [
  {
    title: 'Wedding Films',
    img: 'https://images.unsplash.com/photo-1585647347384-2593bc35786b?w=600&q=80',
    desc: 'Cinematic wedding films that capture emotion, atmosphere, and every precious moment.',
    videoSrc: 'https://www.youtube.com/embed/lsWndfzuOc4?autoplay=1&rel=0',
  },
  {
    title: 'Corporate Videos',
    img: 'https://images.unsplash.com/photo-1551808525-51a94da548ce?w=600&q=80',
    desc: 'Brand videos, annual reports, product demos, and executive interviews.',
    videoSrc: 'https://www.youtube.com/embed/ScMzIvxBSi4?autoplay=1&rel=0',
  },
  {
    title: 'Documentaries',
    img: 'https://images.unsplash.com/photo-1574269907823-3c4b5c08e4e7?w=600&q=80',
    desc: 'Narrative-driven storytelling for NGOs, brands, and impact projects.',
    videoSrc: 'https://www.youtube.com/embed/EngW7tLk6R8?autoplay=1&rel=0',
  },
  {
    title: 'Commercial Production',
    img: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=600&q=80',
    desc: 'TV commercials, social media ads, and branded content campaigns.',
    videoSrc: 'https://www.youtube.com/embed/XSGBVzeBUbk?autoplay=1&rel=0',
  },
];

const PACKAGES = [
  { name: 'Highlights', price: 'KES 60,000', duration: '3–5 min film', includes: ['One camera operator', 'Colour graded edit', '2-week delivery', 'Digital download'] },
  { name: 'Cinematic',  price: 'KES 120,000', duration: '8–12 min film', includes: ['Two camera operators', 'Professional audio', 'Drone footage', 'Highlight + full edit', 'Priority delivery'], featured: true },
  { name: 'Production', price: 'KES 250,000+', duration: 'Full production', includes: ['Full production crew', 'Multiple camera angles', 'Professional audio rig', 'Colour grade + grade', 'Music licensing'] },
];

const WA_MSG = encodeURIComponent('Hi, I would like to enquire about your videography services and see demo reels.');

export default function VideographyPage() {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  return (
    <div className="bg-[#0B0B0B]">
      {/* Hero — dark */}
      <div className="relative h-[70vh] min-h-[500px] flex items-end overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="https://images.unsplash.com/photo-1585647347384-2593bc35786b?w=1920&q=80" alt="" aria-hidden className="absolute inset-0 w-full h-full object-cover opacity-55" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B] via-[#0B0B0B]/30 to-transparent" />
        <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16 pb-16">
          <div className="flex items-center gap-3 mb-4"><div className="w-8 h-px bg-[#E10600]" /><span className="text-[10px] font-display tracking-[0.3em] text-[#E10600] uppercase font-semibold">Services</span></div>
          <h1 className="text-[clamp(3rem,8vw,8rem)] font-heading font-light text-white leading-[0.92] mb-4">Videography</h1>
          <p className="text-lg text-white/55 max-w-xl leading-relaxed">Moving images that tell stories, build brands, and create lasting emotional connections.</p>
        </div>
      </div>

      {/* Video type cards — white */}
      <section className="bg-white py-24 md:py-32">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16">
          <div className="flex items-center gap-3 mb-4"><div className="w-8 h-px bg-[#E10600]" /><span className="text-[10px] font-display tracking-[0.3em] text-[#E10600] uppercase font-semibold">Specialisations</span></div>
          <h2 className="text-[clamp(2rem,4vw,4rem)] font-heading font-light text-[#0F0F0F] mb-3">Video Production Services</h2>
          <p className="text-[14px] text-[#0F0F0F]/45 font-display mb-12">Click any card to watch a sample reel</p>
          <div className="grid sm:grid-cols-2 gap-0.5">
            {TYPES.map(({ title, img, desc, videoSrc }) => (
              <button
                key={title}
                onClick={() => setActiveVideo(videoSrc)}
                className="group relative overflow-hidden h-72 sm:h-96 text-left w-full"
                aria-label={`Watch ${title} sample reel`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img} alt={title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

                {/* Centred play button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full border-2 border-white/60 flex items-center justify-center bg-black/30 group-hover:bg-[#E10600] group-hover:border-[#E10600] transition-all duration-300">
                    <Play size={22} fill="white" className="text-white ml-1" />
                  </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-xl font-heading font-light text-white mb-1">{title}</h3>
                  <p className="text-[12px] text-white/75 leading-relaxed">{desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Packages — off-white */}
      <section className="bg-[#F5F5F0] py-24 md:py-32">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16">
          <div className="flex items-center gap-3 mb-4"><div className="w-8 h-px bg-[#E10600]" /><span className="text-[10px] font-display tracking-[0.3em] text-[#E10600] uppercase font-semibold">Pricing</span></div>
          <h2 className="text-[clamp(2rem,4vw,4rem)] font-heading font-light text-[#0F0F0F] mb-12">Video Packages</h2>
          <div className="grid md:grid-cols-3 gap-0.5">
            {PACKAGES.map(({ name, price, duration, includes, featured }) => (
              <div key={name} className={`p-8 border relative ${featured ? 'border-[#E10600]/40 bg-white shadow-md' : 'border-[#0F0F0F]/[0.07] bg-white'}`}>
                {featured && <div className="absolute -top-px left-0 right-0 h-[2px] bg-[#E10600]" />}
                {featured && <div className="text-[9px] font-display tracking-widest uppercase text-[#E10600] mb-3">Most Popular</div>}
                <h3 className="text-2xl font-heading font-light text-[#0F0F0F] mb-1">{name}</h3>
                <div className="text-3xl font-heading text-[#0F0F0F] mb-1">{price}</div>
                <div className="text-[11px] text-[#0F0F0F]/35 font-display mb-6">{duration}</div>
                <ul className="space-y-2.5 mb-8">
                  {includes.map((inc) => <li key={inc} className="flex items-center gap-2.5 text-[13px] text-[#0F0F0F]/65"><Check size={13} className="text-[#E10600] shrink-0" />{inc}</li>)}
                </ul>
                <Link href="/booking" className={`${featured ? 'btn-primary' : 'btn-outline-dark'} w-full justify-center`}>Book This Package</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA — dark */}
      <section className="bg-[#0B0B0B] py-20 text-center px-4">
        <h2 className="text-[clamp(1.8rem,4vw,3.5rem)] font-heading font-light text-white mb-4">Bring your vision to life</h2>
        <p className="text-white/55 mb-8 max-w-md mx-auto text-sm">Award-winning video production from pre-production to final delivery.</p>
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
          <Link href="/booking" className="btn-primary group">Book a Video Session <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" /></Link>
          <a href={`https://wa.me/254700864849?text=${WA_MSG}`} target="_blank" rel="noopener noreferrer" className="btn-outline group flex items-center gap-2">
            <MessageCircle size={14} /> Request Demo Reel
          </a>
        </div>
      </section>

      {/* Video modal */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
            onClick={() => setActiveVideo(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-5xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setActiveVideo(null)}
                aria-label="Close video"
                className="absolute -top-12 right-0 text-white/50 hover:text-white transition-colors flex items-center gap-2 text-[11px] font-display tracking-widest uppercase"
              >
                Close <X size={18} />
              </button>
              <div className="aspect-video w-full bg-black">
                <iframe
                  src={activeVideo}
                  className="w-full h-full"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                  title="Mejasan Media — Sample Reel"
                />
              </div>
              <p className="mt-4 text-center text-[12px] text-white/30 font-display">
                Sample reel · Full portfolio available on request ·{' '}
                <a href="/contact" className="text-[#E10600] hover:underline">Contact us</a>
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
