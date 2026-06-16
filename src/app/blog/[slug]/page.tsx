import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, ArrowRight } from 'lucide-react';

interface Params { params: Promise<{ slug: string }> }

const POSTS: Record<string, {
  title: string; excerpt: string; category: string; author: string;
  avatar: string; date: string; readTime: number; cover: string; content: string;
}> = {
  'how-to-plan-your-wedding-photography': {
    title: 'How to Plan Your Wedding Photography Timeline',
    excerpt: 'The secret to stress-free wedding day photos lies in your timeline.',
    category: 'Weddings', author: 'Jason Mejia',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&q=80',
    date: 'November 15, 2024', readTime: 6,
    cover: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1920&q=80',
    content: `
## The Most Common Wedding Photo Mistake

The most common regret couples have after their wedding day is not having enough time for portraits. The reason is almost always a rushed timeline — ceremonies running late, long travel between venues, or unexpected delays.

Here's how to build a timeline that protects your most important moments.

## Build in Buffer Time

Every transition takes longer than you think. Getting the wedding party ready, travel between locations, gathering grandparents for family portraits — add 15 minutes of buffer for each.

## The Golden Hour Is Non-Negotiable

The 45 minutes before sunset produce the most beautiful natural light. Plan your couple portraits here, even if it means stepping away from cocktail hour briefly. The images will be worth it.

## A Sample Timeline

- **8:00 AM** — Bridal prep begins (allow 2+ hours for hair and makeup)
- **11:00 AM** — Photographer arrives for detail shots and candid prep
- **1:00 PM** — First look (optional but highly recommended)
- **1:30 PM** — Wedding party portraits
- **3:00 PM** — Ceremony begins
- **4:30 PM** — Cocktail hour, family formals
- **6:00 PM** — Golden hour couple portraits (15–20 min)
- **7:00 PM** — Reception begins

## Communication Is Everything

Share your timeline with your planner, venue coordinator, and photography team at least 2 weeks before the wedding. When everyone knows the plan, everyone can protect the plan.

The best wedding photos aren't accidents — they're the result of intentional planning and a team that knows exactly what's coming next.
    `,
  },
  'aerial-photography-kenya-guide': {
    title: 'A Complete Guide to Drone Photography in Kenya',
    excerpt: 'Everything you need to know about KCAA regulations, best locations, and aerial imagery.',
    category: 'Drone', author: 'Brian Ochieng',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80',
    date: 'October 28, 2024', readTime: 8,
    cover: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=1920&q=80',
    content: `
## Drone Photography in Kenya: What You Need to Know

Kenya is one of Africa's most visually stunning countries — from the skyscrapers of Nairobi to the savannah of the Maasai Mara. Aerial photography captures perspectives that are simply impossible from the ground.

## KCAA Licensing Requirements

The Kenya Civil Aviation Authority (KCAA) requires all commercial drone operators to hold a Remote Pilot Licence (RPL). This involves:

- Written examination on airspace regulations
- Practical flight assessment
- Aircraft registration for drones over 250g
- NOTAM (Notice to Airmen) filing before each flight

Operating without a licence risks significant fines and equipment seizure. Always verify your photographer holds valid KCAA credentials.

## Restricted Airspace in Kenya

Kenya has several permanent no-fly zones including:
- Within 5km of international airports (JKIA, Wilson, Moi)
- Government buildings and State House
- Military installations
- National Parks (require KWS permits)

## Best Locations for Aerial Photography

1. **Nairobi CBD** — Urban skyline and the convergence of city and Nairobi National Park
2. **Maasai Mara** — Sweeping savannah views (KWS permit required)
3. **Lake Nakuru & Naivasha** — Flamingo flocks and Rift Valley landscapes
4. **Diani Beach** — Indian Ocean coastline from above
5. **Mount Kenya** — Alpine landscapes and glaciers

## Choosing the Right Aerial Photographer

Look for: KCAA RPL documentation, minimum public liability insurance of KES 5M, modern aircraft (DJI Mavic 3 Pro or equivalent), and a portfolio of work in your specific environment type.

At Mejasan, every drone flight is planned, permitted, and insured. Your project deserves nothing less.
    `,
  },
};

const DEFAULT = {
  title: 'Blog Post', excerpt: 'Read our latest insights.', category: 'Journal',
  author: 'Mejasan Team', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&q=80',
  date: 'January 2025', readTime: 5,
  cover: 'https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=1920&q=80',
  content: '## Coming Soon\n\nThis article is being prepared. Check back soon for the full story.',
};

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = POSTS[slug] ?? DEFAULT;
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: { type: 'article', images: [{ url: post.cover }] },
  };
}

function mdToHtml(md: string): string {
  return md
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^- \*\*(.+?)\*\* — (.+)$/gm, '<li><strong>$1</strong> — $2</li>')
    .replace(/^\d+\. \*\*(.+?)\*\* — (.+)$/gm, '<li><strong>$1</strong> — $2</li>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/^(?!<[h|l])/gm, '')
    .replace(/<li>/g, '</p><ul><li>').replace(/<\/li>\n?<\/ul>/g, '</li></ul><p>')
    .trim();
}

export default async function BlogPostPage({ params }: Params) {
  const { slug } = await params;
  const post = POSTS[slug] ?? { ...DEFAULT, title: slug.replace(/-/g,' ').replace(/\b\w/g,c=>c.toUpperCase()) };
  const htmlContent = mdToHtml(post.content);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    author: { '@type': 'Person', name: post.author },
    datePublished: post.date,
    image: post.cover,
    publisher: { '@type': 'Organization', name: 'Mejasan Media Production', logo: 'https://mejasanmedia.com/mejasan-logo.jpg' },
  };

  return (
    <div className="bg-[#0B0B0B]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero */}
      <div className="relative h-[60vh] min-h-[400px] flex items-end overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={post.cover} alt={post.title} className="absolute inset-0 w-full h-full object-cover opacity-45" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B] via-[#0B0B0B]/30 to-transparent" />
        <div className="relative z-10 max-w-[900px] mx-auto px-4 sm:px-8 pb-14 w-full">
          <Link href="/blog" className="inline-flex items-center gap-2 text-[10px] font-display text-white/30 hover:text-white transition-colors mb-6 tracking-widest uppercase">
            <ArrowLeft size={12} /> Journal
          </Link>
          <div className="text-[10px] font-display tracking-widest text-[#E10600] uppercase mb-3">{post.category}</div>
          <h1 className="text-[clamp(1.8rem,4vw,3.5rem)] font-heading font-light text-white leading-tight mb-4">{post.title}</h1>
          <div className="flex items-center gap-4 text-[11px] text-white/30 font-display">
            <span className="flex items-center gap-1.5"><Calendar size={11} />{post.date}</span>
            <span className="flex items-center gap-1.5"><Clock size={11} />{post.readTime} min read</span>
          </div>
        </div>
      </div>

      {/* Author */}
      <div className="max-w-[900px] mx-auto px-4 sm:px-8 py-8 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={post.avatar} alt={post.author} className="w-9 h-9 rounded-full object-cover" />
          <div>
            <div className="text-[12px] font-display font-semibold text-white">{post.author}</div>
            <div className="text-[10px] text-white/30 font-display">Mejasan Media Production</div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[900px] mx-auto px-4 sm:px-8 py-14">
        <div
          className="prose prose-invert prose-lg max-w-none prose-headings:font-heading prose-headings:font-light prose-h2:text-3xl prose-p:text-white/55 prose-p:leading-relaxed prose-strong:text-white prose-li:text-white/55"
          dangerouslySetInnerHTML={{ __html: `<p>${htmlContent}</p>` }}
        />
      </div>

      {/* CTA */}
      <div className="max-w-[900px] mx-auto px-4 sm:px-8 pb-20">
        <div className="bg-[#141414] border border-white/[0.06] p-8 sm:p-10 text-center">
          <div className="text-[10px] font-display tracking-widest text-[#E10600] uppercase mb-4">Ready to Work Together?</div>
          <h2 className="text-2xl sm:text-3xl font-heading font-light text-white mb-4">Bring Your Story to Life</h2>
          <p className="text-white/40 text-sm mb-6 max-w-sm mx-auto">Our team is ready to create something extraordinary for you.</p>
          <Link href="/booking" className="btn-primary inline-flex group">
            Book a Session <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
