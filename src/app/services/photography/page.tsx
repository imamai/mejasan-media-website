import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Photography Services',
  description: 'Professional wedding, corporate, product and studio photography in Nairobi and across Kenya.',
};

const PACKAGES = [
  { name: 'Essential', price: 'KES 45,000', hours: '4 hours', imgs: '200+ edited', coverage: '1 photographer', includes: ['Online gallery delivery', 'High-res digital files', '2-week turnaround', 'Print release'] },
  { name: 'Premium',   price: 'KES 85,000', hours: '8 hours', imgs: '400+ edited', coverage: '2 photographers', includes: ['Everything in Essential', 'Engagement session', 'Album design', 'Drone coverage'], featured: true },
  { name: 'Luxury',    price: 'KES 150,000+', hours: 'Full day', imgs: '600+ edited', coverage: '2 photographers + video', includes: ['Everything in Premium', 'Cinematic highlights', 'Hardcover album', 'Priority editing'] },
];

const CATS = [
  { title: 'Wedding Photography',    img: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80', desc: 'Timeless, emotive documentation of your most important day.' },
  { title: 'Corporate Photography',  img: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80', desc: 'Headshots, events, and brand imagery that builds authority.' },
  { title: 'Product Photography',    img: 'https://images.unsplash.com/photo-1585297029439-2a5e8d0c0cfe?w=600&q=80', desc: 'E-commerce, packshots, and lifestyle imagery that sells.' },
  { title: 'Studio Photography',     img: 'https://images.unsplash.com/photo-1574269907823-3c4b5c08e4e7?w=600&q=80', desc: 'Controlled studio sessions with premium lighting setups.' },
];

export default function PhotographyPage() {
  return (
    <div className="bg-[#0B0B0B]">
      {/* Hero — dark */}
      <div className="relative h-[70vh] min-h-[500px] flex items-end overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="https://images.unsplash.com/photo-1519741497674-611481863552?w=1920&q=80" alt="Photography" aria-hidden className="absolute inset-0 w-full h-full object-cover opacity-55" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B] via-[#0B0B0B]/30 to-transparent" />
        <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16 pb-16">
          <div className="flex items-center gap-3 mb-4"><div className="w-8 h-px bg-[#E10600]" /><span className="text-[10px] font-display tracking-[0.3em] text-[#E10600] uppercase font-semibold">Services</span></div>
          <h1 className="text-[clamp(3rem,8vw,8rem)] font-heading font-light text-white leading-[0.92] mb-4">Photography</h1>
          <p className="text-base sm:text-lg text-white/55 max-w-xl leading-relaxed">Capturing emotion, light, and story — from intimate weddings to large-scale corporate productions.</p>
        </div>
      </div>

      {/* Categories — light */}
      <section className="bg-white py-24 md:py-32">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16">
          <div className="flex items-center gap-3 mb-4"><div className="w-8 h-px bg-[#E10600]" /><span className="text-[10px] font-display tracking-[0.3em] text-[#E10600] uppercase font-semibold">Specialisations</span></div>
          <h2 className="text-[clamp(2rem,4vw,4rem)] font-heading font-light text-[#0F0F0F] mb-12">Photography Services</h2>
          <div className="grid sm:grid-cols-2 gap-0.5">
            {CATS.map(({ title, img, desc }) => (
              <div key={title} className="group relative overflow-hidden h-64 sm:h-80">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img} alt={title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-xl font-heading font-light text-white mb-1">{title}</h3>
                  <p className="text-[12px] text-white/75 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Packages — off-white */}
      <section className="bg-[#F5F5F0] py-24 md:py-32">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16">
          <div className="flex items-center gap-3 mb-4"><div className="w-8 h-px bg-[#E10600]" /><span className="text-[10px] font-display tracking-[0.3em] text-[#E10600] uppercase font-semibold">Pricing</span></div>
          <h2 className="text-[clamp(2rem,4vw,4rem)] font-heading font-light text-[#0F0F0F] mb-12">Photography Packages</h2>
          <div className="grid md:grid-cols-3 gap-0.5">
            {PACKAGES.map(({ name, price, hours, imgs, coverage, includes, featured }) => (
              <div key={name} className={`p-8 border relative ${featured ? 'border-[#E10600]/40 bg-white shadow-md' : 'border-[#0F0F0F]/[0.07] bg-white'}`}>
                {featured && <div className="absolute -top-px left-0 right-0 h-[2px] bg-[#E10600]" />}
                {featured && <div className="text-[9px] font-display tracking-widest uppercase text-[#E10600] mb-3">Most Popular</div>}
                <h3 className="text-2xl font-heading font-light text-[#0F0F0F] mb-2">{name}</h3>
                <div className="text-3xl font-heading text-[#0F0F0F] mb-1">{price}</div>
                <div className="text-[11px] text-[#0F0F0F]/35 font-display mb-6">{hours} · {imgs} · {coverage}</div>
                <ul className="space-y-2.5 mb-8">
                  {includes.map((inc) => (
                    <li key={inc} className="flex items-center gap-2.5 text-[13px] text-[#0F0F0F]/65">
                      <Check size={13} className="text-[#E10600] shrink-0" />{inc}
                    </li>
                  ))}
                </ul>
                <Link href="/booking" className={`btn-${featured ? 'primary' : 'outline-dark'} w-full justify-center`}>Book This Package</Link>
              </div>
            ))}
          </div>
          <p className="text-[12px] text-[#0F0F0F]/30 mt-6 text-center font-display">All packages customisable. Contact us for destination and international pricing.</p>
        </div>
      </section>

      {/* CTA — dark band */}
      <section className="bg-[#0B0B0B] py-20 text-center px-4">
        <h2 className="text-[clamp(1.8rem,4vw,3.5rem)] font-heading font-light text-white mb-4">Ready to tell your story?</h2>
        <p className="text-white/55 mb-8 max-w-md mx-auto text-sm">Every great image starts with a conversation. Let&apos;s discuss your vision.</p>
        <Link href="/booking" className="btn-primary inline-flex group">Book a Photography Session <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" /></Link>
      </section>
    </div>
  );
}
