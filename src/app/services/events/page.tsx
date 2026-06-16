import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Mic, Trophy, Music, Radio, Monitor } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Event Coverage Services',
  description: 'Professional event photography and videography for conferences, launches, award ceremonies, and concerts in Kenya.',
};

const TYPES = [
  { icon: Monitor, title: 'Conferences & Summits',   desc: 'Multi-day documentation for international conferences, panel discussions, and keynote sessions.', img: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80' },
  { icon: Mic,     title: 'Product Launches',         desc: 'Brand launches, press releases, and product reveal events with cinematic coverage.', img: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=600&q=80' },
  { icon: Trophy,  title: 'Award Ceremonies',         desc: 'Gala dinners, awards nights, and recognition events documented with elegance.', img: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&q=80' },
  { icon: Music,   title: 'Concerts & Performances',  desc: 'Live music, theatre, and performance arts captured with high-ISO precision.', img: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600&q=80' },
  { icon: Radio,   title: 'Livestreaming',            desc: 'Professional multi-camera livestreaming for hybrid and virtual events.', img: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&q=80' },
];

export default function EventsPage() {
  return (
    <div className="bg-[#0B0B0B]">
      {/* Hero — dark */}
      <div className="relative h-[70vh] min-h-[500px] flex items-end overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1920&q=80" alt="" aria-hidden className="absolute inset-0 w-full h-full object-cover opacity-55" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B] via-[#0B0B0B]/30 to-transparent" />
        <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16 pb-16">
          <div className="flex items-center gap-3 mb-4"><div className="w-8 h-px bg-[#E10600]" /><span className="text-[10px] font-display tracking-[0.3em] text-[#E10600] uppercase font-semibold">Services</span></div>
          <h1 className="text-[clamp(3rem,8vw,8rem)] font-heading font-light text-white leading-[0.92] mb-4">Event Coverage</h1>
          <p className="text-lg text-white/55 max-w-xl leading-relaxed">From international summits to intimate product launches — comprehensive event documentation at world-class standard.</p>
        </div>
      </div>

      {/* Event types — white */}
      <section className="bg-white py-24 md:py-32">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16">
          <div className="flex items-center gap-3 mb-4"><div className="w-8 h-px bg-[#E10600]" /><span className="text-[10px] font-display tracking-[0.3em] text-[#E10600] uppercase font-semibold">Event Types</span></div>
          <h2 className="text-[clamp(2rem,4vw,4rem)] font-heading font-light text-[#0F0F0F] mb-12">Events We Cover</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-0.5">
            {TYPES.map(({ icon: Icon, title, desc, img }) => (
              <div key={title} className="group relative overflow-hidden h-64 sm:h-72">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img} alt={title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-all duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="w-9 h-9 bg-[#E10600]/80 flex items-center justify-center mb-3 group-hover:bg-[#E10600] transition-colors">
                    <Icon size={16} className="text-white" />
                  </div>
                  <h3 className="text-xl font-heading font-light text-white mb-1">{title}</h3>
                  <p className="text-[12px] text-white/75 leading-relaxed line-clamp-2">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Highlights — off-white */}
      <section className="bg-[#F5F5F0] py-20">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16 grid md:grid-cols-3 gap-0.5">
          {[
            { title: 'Fast Delivery', desc: 'Same-day previews for press. Full gallery within 5 business days.' },
            { title: 'Multi-Camera', desc: 'Up to 4 simultaneous camera operators for comprehensive coverage.' },
            { title: 'Discreet', desc: 'Unobtrusive coverage that never interrupts the flow of your event.' },
          ].map(({ title, desc }) => (
            <div key={title} className="p-6 border border-[#0F0F0F]/[0.07] bg-white">
              <div className="w-1 h-8 bg-[#E10600] mb-4" />
              <h3 className="font-display font-semibold text-[#0F0F0F] mb-2">{title}</h3>
              <p className="text-[13px] text-[#0F0F0F]/55 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA — dark */}
      <section className="bg-[#0B0B0B] py-20 text-center px-4">
        <h2 className="text-[clamp(1.8rem,4vw,3.5rem)] font-heading font-light text-white mb-4">Planning an event?</h2>
        <p className="text-white/55 mb-8 max-w-md mx-auto text-sm">Let us discuss your event and build a custom coverage plan.</p>
        <Link href="/booking" className="btn-primary inline-flex group">Book Event Coverage <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" /></Link>
      </section>
    </div>
  );
}
