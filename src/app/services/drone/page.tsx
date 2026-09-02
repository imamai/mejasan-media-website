import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Check, Shield } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { getPageContent, type DroneContent } from '@/lib/page-content-schema';

export const metadata: Metadata = {
  title: 'Drone Services',
  description: 'KCAA-licensed aerial photography, videography, mapping and site documentation across Kenya and East Africa.',
};

export default async function DronePage() {
  const sb = await createClient();
  const { data } = await sb.from('mejasan_page_content').select('content').eq('page_slug', 'services-drone').maybeSingle();
  const content = getPageContent('services-drone', data?.content) as DroneContent;
  const { hero, services, fleetLabel, fleetHeading, fleet, guaranteeLabel, guaranteeHeading, guaranteeItems, cta } = content;

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
          <div className="flex items-center gap-2 mb-3">
            <Shield size={14} className="text-[#E10600]" />
            <span className="text-[11px] font-display text-[#E10600] tracking-widest uppercase font-semibold">{hero.badgeText}</span>
          </div>
          <p className="text-lg text-white/55 max-w-xl leading-relaxed">{hero.subtitle}</p>
        </div>
      </div>

      {/* Service cards — white */}
      <section className="bg-white py-24 md:py-32">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16 grid sm:grid-cols-2 gap-0.5">
          {services.map(({ title, img, imgPosition, desc }) => (
            <div key={title} className="group relative overflow-hidden h-64 sm:h-80">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img} alt={title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-all duration-700" style={{ objectPosition: imgPosition }} />
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
            <div className="flex items-center gap-3 mb-4"><div className="w-8 h-px bg-[#E10600]" /><span className="text-[10px] font-display tracking-[0.3em] text-[#E10600] uppercase font-semibold">{fleetLabel}</span></div>
            <h2 className="text-[clamp(2rem,4vw,4rem)] font-heading font-light text-[#0F0F0F] mb-8">{fleetHeading}</h2>
            <div className="space-y-4">
              {fleet.map(({ name, specs }) => (
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
            <div className="flex items-center gap-3 mb-4"><div className="w-8 h-px bg-[#E10600]" /><span className="text-[10px] font-display tracking-[0.3em] text-[#E10600] uppercase font-semibold">{guaranteeLabel}</span></div>
            <h2 className="text-[clamp(2rem,4vw,4rem)] font-heading font-light text-[#0F0F0F] mb-8">{guaranteeHeading}</h2>
            <ul className="space-y-4">
              {guaranteeItems.map((item) => (
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
        <h2 className="text-[clamp(1.8rem,4vw,3.5rem)] font-heading font-light text-white mb-4">{cta.heading}</h2>
        <p className="text-white/55 mb-8 max-w-md mx-auto text-sm">{cta.text}</p>
        <Link href="/booking" className="btn-primary inline-flex group">{cta.buttonLabel} <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" /></Link>
      </section>
    </div>
  );
}
