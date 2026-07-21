import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Layers, Share2, BookOpen, Megaphone, type LucideIcon } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { getPageContent, type BrandingContent } from '@/lib/page-content-schema';

export const metadata: Metadata = {
  title: 'Branding & Content Services',
  description: 'Brand content strategy, social media content production, and campaign production for Kenyan businesses.',
};

function iconFor(title: string): LucideIcon {
  const t = title.toLowerCase();
  if (t.includes('strategy')) return BookOpen;
  if (t.includes('social')) return Share2;
  if (t.includes('storytelling') || t.includes('brand')) return Layers;
  if (t.includes('campaign')) return Megaphone;
  return Layers;
}

export default async function BrandingPage() {
  const sb = await createClient();
  const { data } = await sb.from('mejasan_page_content').select('content').eq('page_slug', 'services-branding').maybeSingle();
  const content = getPageContent('services-branding', data?.content) as BrandingContent;
  const { hero, services, process, cta } = content;

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

      {/* Service cards — white */}
      <section className="bg-white py-24 md:py-32">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16 grid sm:grid-cols-2 gap-0.5">
          {services.map(({ title, img, imgPosition, desc }) => {
            const Icon = iconFor(title);
            return (
              <div key={title} className="group relative overflow-hidden h-64 sm:h-80">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img} alt={title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-all duration-700" style={{ objectPosition: imgPosition }} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="w-9 h-9 bg-[#E10600]/80 flex items-center justify-center mb-3 group-hover:bg-[#E10600] transition-colors">
                    <Icon size={16} className="text-white" />
                  </div>
                  <h3 className="text-xl font-heading font-light text-white mb-1">{title}</h3>
                  <p className="text-[12px] text-white/75 leading-relaxed">{desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Process — off-white */}
      <section className="bg-[#F5F5F0] py-24 md:py-32">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16">
          <div className="flex items-center gap-3 mb-4"><div className="w-8 h-px bg-[#E10600]" /><span className="text-[10px] font-display tracking-[0.3em] text-[#E10600] uppercase font-semibold">The Approach</span></div>
          <h2 className="text-[clamp(2rem,4vw,4rem)] font-heading font-light text-[#0F0F0F] mb-12">How We Build Brands</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {process.map(({ num, title, desc }) => (
              <div key={num} className="flex gap-4">
                <span className="text-4xl font-heading font-light text-[#E10600]/20 shrink-0 leading-none">{num}</span>
                <div>
                  <h4 className="font-display font-semibold text-[#0F0F0F] mb-1.5 text-[14px]">{title}</h4>
                  <p className="text-[12px] text-[#0F0F0F]/55 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA — dark */}
      <section className="bg-[#0B0B0B] py-20 text-center px-4">
        <h2 className="text-[clamp(1.8rem,4vw,3.5rem)] font-heading font-light text-white mb-4">{cta.heading}</h2>
        <p className="text-white/55 mb-8 max-w-md mx-auto text-sm">{cta.text}</p>
        <Link href="/booking" className="btn-primary inline-flex group">Start Your Brand Project <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" /></Link>
      </section>
    </div>
  );
}
