import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Check, Shield } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Drone Services',
  description: 'KCAA-licensed aerial photography, videography, mapping and site documentation across Kenya and East Africa.',
};

const SERVICES = [
  { title: 'Aerial Photography',  img: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=600&q=80', desc: 'High-resolution stills from above — for real estate, tourism, events, and campaigns.' },
  { title: 'Aerial Videography',  img: 'https://images.unsplash.com/photo-1508444845599-5c89863b1c44?w=600&q=80', desc: 'Cinematic drone footage with stable 4K/6K capture and smooth orbital movements.' },
  { title: 'Mapping & Survey',    img: 'https://images.unsplash.com/photo-1494783367193-149034c05e8f?w=600&q=80', desc: 'Photogrammetric mapping, orthomosaics, and 3D models for construction and engineering.' },
  { title: 'Site Documentation',  img: 'https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?w=600&q=80', desc: 'Progress documentation for construction sites, infrastructure, and land development.' },
];

const FLEET = [
  { name: 'DJI Mavic 3 Pro',    specs: '5.1K · 28x zoom · 46-min flight time' },
  { name: 'DJI Air 3',          specs: '4K · Dual camera · 46-min flight time' },
  { name: 'DJI Phantom 4 RTK',  specs: 'Survey grade · PPK/RTK GPS · Mapping' },
];

export default function DronePage() {
  return (
    <div className="bg-[#0B0B0B]">
      {/* Hero — dark */}
      <div className="relative h-[70vh] min-h-[500px] flex items-end overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=1920&q=80" alt="" aria-hidden className="absolute inset-0 w-full h-full object-cover opacity-55" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B] via-[#0B0B0B]/30 to-transparent" />
        <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16 pb-16">
          <div className="flex items-center gap-3 mb-4"><div className="w-8 h-px bg-[#E10600]" /><span className="text-[10px] font-display tracking-[0.3em] text-[#E10600] uppercase font-semibold">Services</span></div>
          <h1 className="text-[clamp(3rem,8vw,8rem)] font-heading font-light text-white leading-[0.92] mb-4">Drone Services</h1>
          <div className="flex items-center gap-2 mb-3">
            <Shield size={14} className="text-[#E10600]" />
            <span className="text-[11px] font-display text-[#E10600] tracking-widest uppercase font-semibold">KCAA Licensed Operator</span>
          </div>
          <p className="text-lg text-white/55 max-w-xl leading-relaxed">Aerial perspectives that transform how the world sees your project — safely, legally, and beautifully.</p>
        </div>
      </div>

      {/* Service cards — white */}
      <section className="bg-white py-24 md:py-32">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16 grid sm:grid-cols-2 gap-0.5">
          {SERVICES.map(({ title, img, desc }) => (
            <div key={title} className="group relative overflow-hidden h-64 sm:h-80">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img} alt={title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-all duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-xl font-heading font-light text-white mb-1">{title}</h3>
                <p className="text-[12px] text-white/75 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Fleet & Guarantee — off-white */}
      <section className="bg-[#F5F5F0] py-24 md:py-32">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16 grid lg:grid-cols-2 gap-16">
          <div>
            <div className="flex items-center gap-3 mb-4"><div className="w-8 h-px bg-[#E10600]" /><span className="text-[10px] font-display tracking-[0.3em] text-[#E10600] uppercase font-semibold">Our Fleet</span></div>
            <h2 className="text-[clamp(2rem,4vw,4rem)] font-heading font-light text-[#0F0F0F] mb-8">Professional Grade Aircraft</h2>
            <div className="space-y-4">
              {FLEET.map(({ name, specs }) => (
                <div key={name} className="flex items-start gap-4 p-5 border border-[#0F0F0F]/[0.07] bg-white">
                  <div className="w-2 h-2 rounded-full bg-[#E10600] mt-1.5 shrink-0" />
                  <div>
                    <div className="font-display font-semibold text-[#0F0F0F] text-sm">{name}</div>
                    <div className="text-[12px] text-[#0F0F0F]/40 font-display mt-0.5">{specs}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-3 mb-4"><div className="w-8 h-px bg-[#E10600]" /><span className="text-[10px] font-display tracking-[0.3em] text-[#E10600] uppercase font-semibold">Our Guarantee</span></div>
            <h2 className="text-[clamp(2rem,4vw,4rem)] font-heading font-light text-[#0F0F0F] mb-8">Safe, Legal & Insured</h2>
            <ul className="space-y-4">
              {[
                'KCAA-certified remote pilot licence',
                'Professional liability insurance',
                'NOTAM permits handled on your behalf',
                'No-fly zone awareness & compliance',
                'Full pre-flight safety briefings',
                'Post-flight geo-tagged data delivery',
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-[14px] text-[#0F0F0F]/60">
                  <Check size={14} className="text-[#E10600] shrink-0" />{item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CTA — dark */}
      <section className="bg-[#0B0B0B] py-20 text-center px-4">
        <h2 className="text-[clamp(1.8rem,4vw,3.5rem)] font-heading font-light text-white mb-4">See the world from above</h2>
        <p className="text-white/55 mb-8 max-w-md mx-auto text-sm">KCAA-licensed aerial services across Kenya and East Africa.</p>
        <Link href="/booking" className="btn-primary inline-flex group">Book Drone Services <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" /></Link>
      </section>
    </div>
  );
}
