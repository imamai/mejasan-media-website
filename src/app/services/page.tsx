import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Camera, Video, Aperture, Wind, Layers } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Our Services',
  description: 'Full-service media production in Kenya — photography, videography, drone, event coverage, and brand content.',
};

const SERVICES = [
  {
    icon: Camera,
    title: 'Photography',
    href: '/services/photography',
    img: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80',
    desc: 'Wedding, corporate, product & studio photography that tells your story with technical mastery and artistic vision.',
    tags: ['Wedding', 'Corporate', 'Product', 'Studio'],
  },
  {
    icon: Video,
    title: 'Videography',
    href: '/services/videography',
    img: 'https://images.unsplash.com/photo-1585647347384-2593bc35786b?w=800&q=80',
    desc: 'Wedding films, corporate videos, documentaries & commercial production with cinematic precision.',
    tags: ['Wedding Films', 'Corporate', 'Documentary', 'Commercial'],
  },
  {
    icon: Aperture,
    title: 'Event Coverage',
    href: '/services/events',
    img: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
    desc: 'Conferences, launches, awards & concerts — live documentation at the highest professional standard.',
    tags: ['Conferences', 'Launches', 'Awards', 'Concerts'],
  },
  {
    icon: Wind,
    title: 'Drone Services',
    href: '/services/drone',
    img: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800&q=80',
    desc: 'KCAA-licensed aerial photography, videography, mapping & site documentation across East Africa.',
    tags: ['Aerial Photography', 'Video', 'Mapping', 'Survey'],
  },
  {
    icon: Layers,
    title: 'Brand & Content',
    href: '/services/branding',
    img: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&q=80',
    desc: 'Social media content, brand storytelling & campaign production that builds lasting presence.',
    tags: ['Social Media', 'Branding', 'Campaigns', 'Strategy'],
  },
];

export default function ServicesPage() {
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
            <span className="text-[11px] font-display font-semibold tracking-[0.3em] text-[#E10600] uppercase">What We Do</span>
          </div>
          <h1 className="text-[clamp(3rem,8vw,8rem)] font-heading font-light text-white leading-[0.92] mb-6 max-w-4xl">
            Full-Service <em className="text-[#E10600] not-italic italic">Media Production</em>
          </h1>
          <p className="text-base sm:text-lg text-white/55 max-w-2xl leading-relaxed">
            From intimate wedding films to large-scale corporate productions — we bring the equipment, expertise, and artistic vision to tell every story with world-class quality.
          </p>
        </div>
      </div>

      {/* Service list — light cards on white */}
      <div className="bg-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16 py-16 space-y-0.5">
          {SERVICES.map(({ icon: Icon, title, href, img, desc, tags }, i) => (
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
                    <span className="text-[10px] font-display text-[#0F0F0F]/20 tracking-[0.3em] uppercase mt-1">
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
                />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Bottom CTA — dark band */}
      <section className="bg-[#0B0B0B] py-20 text-center px-4 border-t border-white/[0.05]">
        <h2 className="text-[clamp(1.8rem,4vw,3.5rem)] font-heading font-light text-white mb-4">Need something custom?</h2>
        <p className="text-white/55 mb-8 max-w-md mx-auto text-[15px] leading-relaxed">
          Every project is unique. Tell us what you need and we&apos;ll build the perfect package.
        </p>
        <Link href="/booking" className="btn-primary inline-flex group">
          Start a Conversation <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </section>
    </div>
  );
}
