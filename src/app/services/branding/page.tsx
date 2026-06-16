import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Layers, Share2, BookOpen, Megaphone } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Branding & Content Services',
  description: 'Brand content strategy, social media content production, and campaign production for Kenyan businesses.',
};

const SERVICES = [
  { icon: BookOpen,   title: 'Content Strategy',     img: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&q=80', desc: 'Data-driven content planning that aligns your visual identity with business goals and audience insight.' },
  { icon: Share2,     title: 'Social Media Content', img: 'https://images.unsplash.com/photo-1611926653458-09294b3142bf?w=600&q=80', desc: "Consistent, high-production social media photography and video for Instagram, LinkedIn, and TikTok." },
  { icon: Layers,     title: 'Brand Storytelling',   img: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600&q=80', desc: "Narrative-driven content that communicates your brand's values, mission, and unique story." },
  { icon: Megaphone,  title: 'Campaign Production',  img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80', desc: 'Full-scale campaign production — concept to delivery — for product launches and seasonal campaigns.' },
];

export default function BrandingPage() {
  return (
    <div className="bg-[#0B0B0B]">
      {/* Hero — dark */}
      <div className="relative h-[70vh] min-h-[500px] flex items-end overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1920&q=80" alt="" aria-hidden className="absolute inset-0 w-full h-full object-cover opacity-55" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B] via-[#0B0B0B]/30 to-transparent" />
        <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16 pb-16">
          <div className="flex items-center gap-3 mb-4"><div className="w-8 h-px bg-[#E10600]" /><span className="text-[10px] font-display tracking-[0.3em] text-[#E10600] uppercase font-semibold">Services</span></div>
          <h1 className="text-[clamp(3rem,8vw,8rem)] font-heading font-light text-white leading-[0.92] mb-4">Brand & Content</h1>
          <p className="text-lg text-white/55 max-w-xl leading-relaxed">Strategic visual content that builds brands, grows audiences, and drives business results.</p>
        </div>
      </div>

      {/* Service cards — white */}
      <section className="bg-white py-24 md:py-32">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16 grid sm:grid-cols-2 gap-0.5">
          {SERVICES.map(({ icon: Icon, title, img, desc }) => (
            <div key={title} className="group relative overflow-hidden h-64 sm:h-80">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img} alt={title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-all duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="w-9 h-9 bg-[#E10600]/80 flex items-center justify-center mb-3 group-hover:bg-[#E10600] transition-colors">
                  <Icon size={16} className="text-white" />
                </div>
                <h3 className="text-xl font-heading font-light text-white mb-1">{title}</h3>
                <p className="text-[12px] text-white/75 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Process — off-white */}
      <section className="bg-[#F5F5F0] py-24 md:py-32">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16">
          <div className="flex items-center gap-3 mb-4"><div className="w-8 h-px bg-[#E10600]" /><span className="text-[10px] font-display tracking-[0.3em] text-[#E10600] uppercase font-semibold">The Approach</span></div>
          <h2 className="text-[clamp(2rem,4vw,4rem)] font-heading font-light text-[#0F0F0F] mb-12">How We Build Brands</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { num: '01', title: 'Brand Audit',      desc: 'We review your existing visual identity and identify gaps and opportunities.' },
              { num: '02', title: 'Strategy',         desc: 'A content strategy aligned to your target audience, platforms, and business goals.' },
              { num: '03', title: 'Production',       desc: 'Monthly or quarterly shoots that produce a consistent, premium visual library.' },
              { num: '04', title: 'Optimise & Grow',  desc: 'Analytics-backed refinements to maximise reach, engagement, and conversion.' },
            ].map(({ num, title, desc }) => (
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
        <h2 className="text-[clamp(1.8rem,4vw,3.5rem)] font-heading font-light text-white mb-4">Build a brand that&apos;s remembered</h2>
        <p className="text-white/55 mb-8 max-w-md mx-auto text-sm">Strategic content production that grows your business — month after month.</p>
        <Link href="/booking" className="btn-primary inline-flex group">Start Your Brand Project <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" /></Link>
      </section>
    </div>
  );
}
