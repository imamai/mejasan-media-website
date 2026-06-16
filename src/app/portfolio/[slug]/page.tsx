import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Star } from 'lucide-react';

interface Params { params: Promise<{ slug: string }> }

const PROJECTS: Record<string, {
  title: string; client: string; category: string; location: string; year: string;
  hero: string; challenge: string; solution: string; results: string[];
  gallery: string[]; testimonial?: { text: string; name: string; role: string };
  related: Array<{ title: string; slug: string; img: string }>;
}> = {
  'sarah-james-wedding': {
    title: 'Sarah & James', client: 'Private Wedding', category: 'Weddings', location: 'Nairobi', year: '2024',
    hero: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1920&q=80',
    challenge: 'The couple wanted a documentary-style wedding film and gallery that felt timeless — not commercial. Every moment from sunrise preparation to the final dance had to be captured authentically.',
    solution: 'We deployed a 3-person team with dual cameras, a drone for aerial ceremony coverage, and a dedicated audio engineer for the speeches. The edit was crafted over 3 weeks to a custom music score.',
    results: ['650+ edited images delivered', '12-minute cinematic wedding film', '3-minute social media highlight', 'Hardcover album designed and printed'],
    gallery: [
      'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80',
      'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=800&q=80',
      'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80',
      'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&q=80',
      'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=800&q=80',
      'https://images.unsplash.com/photo-1460978812857-470ed1c77af0?w=800&q=80',
    ],
    testimonial: { text: 'Mejasan captured every moment with such artistry. The photos are beyond anything we imagined — they\'re not just pictures, they\'re memories that will live forever.', name: 'Sarah Kamau', role: 'Bride' },
    related: [
      { title: 'Mary & Peter', slug: 'mary-peter-wedding', img: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=400&q=80' },
      { title: 'Anne & David', slug: 'anne-david-wedding', img: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400&q=80' },
    ],
  },
  'safaricom-summit-2024': {
    title: 'Safaricom Leadership Summit', client: 'Safaricom PLC', category: 'Corporate', location: 'Nairobi', year: '2024',
    hero: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1920&q=80',
    challenge: 'A 2-day leadership summit with 800 attendees required comprehensive documentation for internal comms, press releases, and annual report use — all with same-day preview delivery.',
    solution: 'Four-camera team with a dedicated drone operator for venue aerials. A same-day editing workflow delivered 50 press-ready images by 6pm on Day 1.',
    results: ['1,200+ images delivered across 2 days', 'Same-day press pack (50 images)', 'Aerial venue coverage', 'Annual report feature spread'],
    gallery: [
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
      'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=800&q=80',
      'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&q=80',
      'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&q=80',
    ],
    testimonial: { text: 'Professional, fast, and exceptional quality. The same-day delivery saved us hours. Safaricom will use Mejasan for all future events.', name: 'James Mwangi', role: 'Marketing Director, Safaricom' },
    related: [
      { title: 'Equity Bank Gala', slug: 'equity-bank-gala', img: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&q=80' },
      { title: 'UN Climate Summit', slug: 'un-climate-summit', img: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=400&q=80' },
    ],
  },
};

const DEFAULT = {
  title: 'Project',  client: 'Client', category: 'Portfolio', location: 'Kenya', year: '2024',
  hero: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1920&q=80',
  challenge: 'A comprehensive visual documentation project requiring premium execution and creative direction.',
  solution: 'Our full-service team brought the necessary equipment, expertise, and creative vision to execute the project to world-class standard.',
  results: ['Premium deliverables on time', 'Client satisfaction guaranteed'],
  gallery: ['https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80','https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80','https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800&q=80'],
  related: [],
};

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const p = PROJECTS[slug] ?? DEFAULT;
  return { title: p.title, description: `${p.category} project for ${p.client} in ${p.location}, ${p.year}.` };
}

export default async function ProjectPage({ params }: Params) {
  const { slug } = await params;
  const p = PROJECTS[slug] ?? { ...DEFAULT, title: slug.replace(/-/g,' ').replace(/\b\w/g,c=>c.toUpperCase()) };

  return (
    <div className="bg-[#0B0B0B]">
      {/* Hero */}
      <div className="relative h-[70vh] min-h-[500px] flex items-end overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={p.hero} alt={p.title} className="absolute inset-0 w-full h-full object-cover opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B] via-[#0B0B0B]/20 to-transparent" />
        <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16 pb-16 w-full">
          <Link href="/portfolio" className="inline-flex items-center gap-2 text-[11px] font-display text-white/30 hover:text-white transition-colors mb-6 tracking-widest uppercase">
            <ArrowLeft size={13} /> Portfolio
          </Link>
          <div className="text-[10px] font-display tracking-widest text-[#E10600] uppercase mb-3">{p.category} · {p.location} · {p.year}</div>
          <h1 className="text-[clamp(2.5rem,7vw,7rem)] font-heading font-light text-white leading-[0.92]">{p.title}</h1>
        </div>
      </div>

      {/* Overview */}
      <section className="py-20 md:py-28">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16 grid lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2 space-y-12">
            <div>
              <div className="text-[10px] font-display tracking-widest text-[#E10600] uppercase mb-4">The Challenge</div>
              <p className="text-[15px] text-white/55 leading-relaxed">{p.challenge}</p>
            </div>
            <div>
              <div className="text-[10px] font-display tracking-widest text-[#E10600] uppercase mb-4">Our Solution</div>
              <p className="text-[15px] text-white/55 leading-relaxed">{p.solution}</p>
            </div>
          </div>
          <div className="space-y-6">
            <div className="p-6 border border-white/[0.06] bg-[#141414]">
              <div className="text-[10px] font-display tracking-widest text-[#E10600] uppercase mb-4">Project Details</div>
              {[['Client', p.client], ['Category', p.category], ['Location', p.location], ['Year', p.year]].map(([k,v]) => (
                <div key={k} className="flex justify-between py-2.5 border-b border-white/[0.05] last:border-0">
                  <span className="text-[11px] font-display text-white/30 uppercase tracking-widest">{k}</span>
                  <span className="text-[12px] text-white/70 font-display">{v}</span>
                </div>
              ))}
            </div>
            <div className="p-6 border border-white/[0.06] bg-[#141414]">
              <div className="text-[10px] font-display tracking-widest text-[#E10600] uppercase mb-4">Results</div>
              <ul className="space-y-2.5">
                {p.results.map((r) => (
                  <li key={r} className="flex items-start gap-2.5 text-[12px] text-white/55">
                    <span className="w-1 h-1 rounded-full bg-[#E10600] mt-1.5 shrink-0" />{r}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="pb-20 md:pb-28">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16">
          <div className="text-[10px] font-display tracking-widest text-[#E10600] uppercase mb-8">Gallery</div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-0.5">
            {p.gallery.map((img, i) => (
              <div key={i} className="aspect-square overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img} alt={`${p.title} ${i + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      {p.testimonial && (
        <section className="bg-[#141414] py-20">
          <div className="max-w-[900px] mx-auto px-4 sm:px-8 lg:px-16 text-center">
            <div className="flex justify-center gap-0.5 mb-8">
              {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="#E10600" className="text-[#E10600]" />)}
            </div>
            <blockquote className="text-[clamp(1.1rem,2.5vw,1.8rem)] font-heading font-light text-white/80 leading-relaxed mb-8">
              &ldquo;{p.testimonial.text}&rdquo;
            </blockquote>
            <div className="font-display font-semibold text-white text-sm">{p.testimonial.name}</div>
            <div className="text-[11px] text-white/35 font-display mt-0.5">{p.testimonial.role}</div>
          </div>
        </section>
      )}

      {/* Related */}
      {p.related.length > 0 && (
        <section className="py-20">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16">
            <div className="text-[10px] font-display tracking-widest text-[#E10600] uppercase mb-8">Related Projects</div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-0.5">
              {p.related.map(({ title, slug: s, img }) => (
                <Link key={s} href={`/portfolio/${s}`} className="group relative block aspect-[4/3] overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors" />
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                    <span className="text-sm font-heading text-white">{title}</span>
                    <ArrowRight size={14} className="text-white/50 group-hover:text-[#E10600] group-hover:translate-x-1 transition-all" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-[#141414] py-16 text-center px-4">
        <h2 className="text-3xl font-heading font-light text-white mb-4">Love what you see?</h2>
        <p className="text-white/40 mb-8 text-sm max-w-sm mx-auto">Let&apos;s create something extraordinary together.</p>
        <Link href="/booking" className="btn-primary inline-flex group">Book a Session <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" /></Link>
      </section>
    </div>
  );
}
