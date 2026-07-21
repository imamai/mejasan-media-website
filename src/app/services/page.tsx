import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Camera, Video, Aperture, Wind, Layers, type LucideIcon } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { getPageContent, type ServicesContent } from '@/lib/page-content-schema';

export const metadata: Metadata = {
  title: 'Our Services',
  description: 'Full-service media production in Kenya — photography, videography, drone, event coverage, and brand content.',
};

function iconFor(title: string): LucideIcon {
  const t = title.toLowerCase();
  if (t.includes('photo')) return Camera;
  if (t.includes('video')) return Video;
  if (t.includes('event')) return Aperture;
  if (t.includes('drone') || t.includes('aerial')) return Wind;
  return Layers;
}

export default async function ServicesPage() {
  const sb = await createClient();
  const { data } = await sb.from('mejasan_page_content').select('content').eq('page_slug', 'services').maybeSingle();
  const content = getPageContent('services', data?.content) as ServicesContent;
  const { hero, services, cta } = content;

  return (
    <div className="bg-[#0B0B0B]">
      {/* Hero — dark, cinematic */}
      <div className="relative pt-32 pb-20 border-b border-white/[0.05] overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -right-60 -top-20 w-[700px] h-[700px] rounded-full bg-[#E10600]/[0.04] blur-[140px]" />
        </div>
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16 relative">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-px bg-[#E10600]" />
            <span className="text-[11px] font-display font-semibold tracking-[0.3em] text-[#E10600] uppercase">{hero.label}</span>
          </div>
          <h1 className="text-[clamp(3rem,8vw,8rem)] font-heading font-light text-white leading-[0.92] mb-6 max-w-4xl">
            {hero.titlePre} <em className="text-[#E10600] not-italic italic">{hero.titleEm}</em>
          </h1>
          <p className="text-base sm:text-lg text-white/55 max-w-2xl leading-relaxed">
            {hero.subtitle}
          </p>
        </div>
      </div>

      {/* Service list — light cards on white */}
      <div className="bg-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16 py-16 space-y-0.5">
          {services.map(({ title, href, img, imgPosition, desc, tags }, i) => {
            const Icon = iconFor(title);
            return (
              <Link
                key={title}
                href={href}
                className="group grid md:grid-cols-[1fr_320px] lg:grid-cols-[1fr_400px] gap-0.5 bg-[#F5F5F0] hover:bg-white hover:shadow-md transition-all duration-300"
              >
                {/* Content */}
                <div className="p-8 sm:p-10 lg:p-12 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between mb-6">
                      <div className="w-12 h-12 bg-[#E10600]/10 flex items-center justify-center group-hover:bg-[#E10600]/20 transition-colors">
                        <Icon size={20} className="text-[#E10600]" />
                      </div>
                      <span className="text-[10px] font-display text-[#0F0F0F]/40 tracking-[0.3em] uppercase mt-1">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                    </div>
                    <h2 className="text-[clamp(1.8rem,3.5vw,3rem)] font-heading font-light text-[#0F0F0F] mb-4 leading-[1.0]">{title}</h2>
                    <p className="text-[15px] text-[#0F0F0F]/55 leading-relaxed mb-6 max-w-lg">{desc}</p>
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <span key={tag} className="text-[10px] font-display tracking-widest uppercase text-[#0F0F0F]/35 border border-[#0F0F0F]/[0.1] px-3 py-1">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="mt-8 flex items-center gap-2 text-[12px] font-display tracking-widest uppercase text-[#E10600] group-hover:gap-4 transition-all">
                    Explore {title} <ArrowRight size={12} />
                  </div>
                </div>

                {/* Image — full brightness */}
                <div className="relative overflow-hidden h-60 md:h-auto min-h-[200px]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img}
                    alt={title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    style={{ objectPosition: imgPosition }}
                  />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Bottom CTA — dark band */}
      <section className="bg-[#0B0B0B] py-20 text-center px-4 border-t border-white/[0.05]">
        <h2 className="text-[clamp(1.8rem,4vw,3.5rem)] font-heading font-light text-white mb-4">{cta.heading}</h2>
        <p className="text-white/55 mb-8 max-w-md mx-auto text-[15px] leading-relaxed">
          {cta.text}
        </p>
        <Link href="/booking" className="btn-primary inline-flex group">
          Start a Conversation <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </section>
    </div>
  );
}
