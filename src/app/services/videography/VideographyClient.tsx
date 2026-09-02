'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Check, Play, X, MessageCircle } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import type { VideographyContent, PhotographyContent } from '@/lib/page-content-schema';

const WA_MSG = encodeURIComponent('Hi, I would like to enquire about your videography services and see demo reels.');

export default function VideographyClient({
  content, traditionalWeddingPackages, weddingQuotation,
}: {
  content: VideographyContent;
  traditionalWeddingPackages: PhotographyContent['traditionalWeddingPackages'];
  weddingQuotation: PhotographyContent['weddingQuotation'];
}) {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const { hero, typesLabel, typesHeading, typesSubheading, types, packagesLabel, packagesHeading, packagesButtonLabel, packages, videoModalFootnote, cta } = content;

  return (
    <div className="bg-[#0B0B0B]">
      {/* Hero — dark */}
      <div className="relative h-[70vh] min-h-[500px] flex items-end overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={hero.image} alt="" aria-hidden className="absolute inset-0 w-full h-full object-cover opacity-55" style={{ objectPosition: hero.imagePosition }} />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B] via-[#0B0B0B]/30 to-transparent" />
        <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16 pb-16">
          <div className="flex items-center gap-3 mb-4"><div className="w-8 h-px bg-[#E10600]" /><span className="text-[10px] font-display tracking-[0.3em] text-[#E10600] uppercase font-semibold">{hero.eyebrow}</span></div>
          <h1 className="text-[clamp(3rem,8vw,8rem)] font-heading font-light text-white leading-[0.92] mb-4">{hero.title}</h1>
          <p className="text-lg text-white/55 max-w-xl leading-relaxed">{hero.subtitle}</p>
        </div>
      </div>

      {/* Video type cards — white */}
      <section className="bg-white py-24 md:py-32">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16">
          <div className="flex items-center gap-3 mb-4"><div className="w-8 h-px bg-[#E10600]" /><span className="text-[10px] font-display tracking-[0.3em] text-[#E10600] uppercase font-semibold">{typesLabel}</span></div>
          <h2 className="text-[clamp(2rem,4vw,4rem)] font-heading font-light text-[#0F0F0F] mb-3">{typesHeading}</h2>
          <p className="text-[14px] text-[#0F0F0F]/45 font-display mb-12">{typesSubheading}</p>
          <div className="grid sm:grid-cols-2 gap-0.5">
            {types.map(({ title, img, imgPosition, desc, videoSrc }) => (
              <button
                key={title}
                onClick={() => setActiveVideo(videoSrc)}
                className="group relative overflow-hidden h-72 sm:h-96 text-left w-full"
                aria-label={`Watch ${title} sample reel`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img} alt={title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" style={{ objectPosition: imgPosition }} />
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
          <div className="flex items-center gap-3 mb-4"><div className="w-8 h-px bg-[#E10600]" /><span className="text-[10px] font-display tracking-[0.3em] text-[#E10600] uppercase font-semibold">{packagesLabel}</span></div>
          <h2 className="text-[clamp(2rem,4vw,4rem)] font-heading font-light text-[#0F0F0F] mb-12">{packagesHeading}</h2>
          <div className="grid md:grid-cols-3 gap-0.5">
            {packages.map(({ name, price, duration, includes, featured }) => (
              <div key={name} className={`p-8 border relative ${featured ? 'border-[#E10600]/40 bg-white shadow-md' : 'border-[#0F0F0F]/[0.07] bg-white'}`}>
                {featured && <div className="absolute -top-px left-0 right-0 h-[2px] bg-[#E10600]" />}
                {featured && <div className="text-[9px] font-display tracking-widest uppercase text-[#E10600] mb-3">Most Popular</div>}
                <h3 className="text-2xl font-heading font-light text-[#0F0F0F] mb-1">{name}</h3>
                <div className="text-3xl font-heading text-[#0F0F0F] mb-1">{price}</div>
                <div className="text-[11px] text-[#0F0F0F]/35 font-display mb-6">{duration}</div>
                <ul className="space-y-2.5 mb-8">
                  {includes.map((inc) => <li key={inc} className="flex items-center gap-2.5 text-[13px] text-[#0F0F0F]/65"><Check size={13} className="text-[#E10600] shrink-0" />{inc}</li>)}
                </ul>
                <Link href="/booking" className={`${featured ? 'btn-primary' : 'btn-outline-dark'} w-full justify-center`}>{packagesButtonLabel}</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Traditional Wedding Packages — off-white (edited under Services — Photography) */}
      <section className="bg-[#F5F5F0] py-24 md:py-32">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16">
          <div className="flex items-center gap-3 mb-4"><div className="w-8 h-px bg-[#E10600]" /><span className="text-[10px] font-display tracking-[0.3em] text-[#E10600] uppercase font-semibold">{traditionalWeddingPackages.label}</span></div>
          <h2 className="text-[clamp(2rem,4vw,4rem)] font-heading font-light text-[#0F0F0F] mb-3">{traditionalWeddingPackages.heading}</h2>
          <p className="text-[14px] text-[#0F0F0F]/50 font-display mb-12 max-w-2xl leading-relaxed">{traditionalWeddingPackages.description}</p>
          <div className="grid md:grid-cols-3 gap-0.5">
            {traditionalWeddingPackages.packages.map(({ label, photographyItems, photographyPrice, printsItems, printsPrice, videographyItems, videographyPrice, addOnsItems, total }) => (
              <div key={label} className="p-8 border border-[#0F0F0F]/[0.07] bg-white flex flex-col">
                <h3 className="text-xl font-heading font-light text-[#0F0F0F] mb-6">{label}</h3>
                <div className="space-y-6 flex-1">
                  <div>
                    <div className="text-[10px] font-display tracking-widest text-[#E10600] uppercase mb-2">Photography</div>
                    <ul className="space-y-1.5 mb-2">
                      {photographyItems.map((it) => <li key={it} className="text-[12px] text-[#0F0F0F]/60 leading-relaxed">{it}</li>)}
                    </ul>
                    <div className="text-[13px] font-display font-semibold text-[#0F0F0F]">{photographyPrice}</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-display tracking-widest text-[#E10600] uppercase mb-2">Prints</div>
                    <ul className="space-y-1.5 mb-2">
                      {printsItems.map((it) => <li key={it} className="text-[12px] text-[#0F0F0F]/60 leading-relaxed">{it}</li>)}
                    </ul>
                    <div className="text-[13px] font-display font-semibold text-[#0F0F0F]">{printsPrice}</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-display tracking-widest text-[#E10600] uppercase mb-2">Videography</div>
                    <ul className="space-y-1.5 mb-2">
                      {videographyItems.map((it) => <li key={it} className="text-[12px] text-[#0F0F0F]/60 leading-relaxed">{it}</li>)}
                    </ul>
                    <div className="text-[13px] font-display font-semibold text-[#0F0F0F]">{videographyPrice}</div>
                  </div>
                  {addOnsItems.length > 0 && (
                    <div>
                      <div className="text-[10px] font-display tracking-widest text-[#E10600] uppercase mb-2">Add-Ons</div>
                      <ul className="space-y-1.5">
                        {addOnsItems.map((it) => <li key={it} className="text-[12px] text-[#0F0F0F]/60 leading-relaxed">{it}</li>)}
                      </ul>
                    </div>
                  )}
                </div>
                <div className="mt-6 pt-4 border-t border-[#0F0F0F]/[0.08] flex items-center justify-between">
                  <span className="text-[10px] font-display tracking-widest text-[#0F0F0F]/40 uppercase">Grand Total</span>
                  <span className="text-lg font-heading font-semibold text-[#E10600]">{total}</span>
                </div>
              </div>
            ))}
          </div>
          {traditionalWeddingPackages.note && <p className="text-[11px] text-[#0F0F0F]/35 mt-8 font-display leading-relaxed">{traditionalWeddingPackages.note}</p>}
        </div>
      </section>

      {/* Wedding Quotation — white (edited under Services — Photography) */}
      <section className="bg-white py-24 md:py-32">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16">
          <div className="flex items-center gap-3 mb-4"><div className="w-8 h-px bg-[#E10600]" /><span className="text-[10px] font-display tracking-[0.3em] text-[#E10600] uppercase font-semibold">{weddingQuotation.label}</span></div>
          <h2 className="text-[clamp(2rem,4vw,4rem)] font-heading font-light text-[#0F0F0F] mb-3">{weddingQuotation.heading}</h2>
          <p className="text-[14px] text-[#0F0F0F]/50 font-display mb-12 max-w-xl leading-relaxed">{weddingQuotation.description}</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-0.5">
            {weddingQuotation.packages.map(({ label, items, price }) => (
              <div key={label} className="p-6 border border-[#0F0F0F]/[0.07] bg-[#F5F5F0] flex flex-col">
                <h3 className="text-lg font-heading font-light text-[#0F0F0F] mb-4">{label}</h3>
                <ul className="space-y-2 mb-6 flex-1">
                  {items.map((it) => (
                    <li key={it} className="flex items-start gap-2 text-[12px] text-[#0F0F0F]/60 leading-relaxed">
                      <Check size={12} className="text-[#E10600] shrink-0 mt-0.5" />{it}
                    </li>
                  ))}
                </ul>
                <div className="text-xl font-heading font-semibold text-[#E10600] pt-4 border-t border-[#0F0F0F]/[0.08]">{price}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA — dark */}
      <section className="bg-[#0B0B0B] py-20 text-center px-4">
        <h2 className="text-[clamp(1.8rem,4vw,3.5rem)] font-heading font-light text-white mb-4">{cta.heading}</h2>
        <p className="text-white/55 mb-8 max-w-md mx-auto text-sm">{cta.text}</p>
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
          <Link href="/booking" className="btn-primary group">{cta.buttonLabel} <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" /></Link>
          <a href={`https://wa.me/254700864849?text=${WA_MSG}`} target="_blank" rel="noopener noreferrer" className="btn-outline group flex items-center gap-2">
            <MessageCircle size={14} /> {cta.demoButtonLabel}
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
                {videoModalFootnote} ·{' '}
                <a href="/contact" className="text-[#E10600] hover:underline">Contact us</a>
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
