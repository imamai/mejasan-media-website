'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, Clock } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  cover_image: string;
  author_name: string;
  read_time: number;
  created_at: string;
}

const FALLBACK: Post[] = [
  { id:'1', slug:'how-to-plan-your-wedding-photography', title:'How to Plan Your Wedding Photography Timeline', excerpt:"The secret to stress-free wedding day photos lies in your timeline. Here's how to structure your day for maximum coverage.", category:'Weddings', cover_image:'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80', author_name:'Jason Mejia', read_time:6, created_at:'2024-11-15' },
  { id:'2', slug:'aerial-photography-kenya-guide', title:'A Complete Guide to Drone Photography in Kenya', excerpt:'Everything you need to know about KCAA regulations, best locations, and how aerial imagery transforms your brand.', category:'Drone', cover_image:'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800&q=80', author_name:'Brian Ochieng', read_time:8, created_at:'2024-10-28' },
  { id:'3', slug:'corporate-video-production-roi', title:'Why Corporate Video Production Has the Highest ROI', excerpt:"Video content drives 49% more revenue growth than non-video users. Here's how to maximise your corporate video investment.", category:'Corporate', cover_image:'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80', author_name:'Sarah Njeri', read_time:5, created_at:'2024-10-10' },
  { id:'4', slug:'event-photography-tips-2024', title:'10 Tips for Capturing Unforgettable Event Photos', excerpt:'Professional event photography requires more than just showing up. These techniques will elevate your event coverage.', category:'Events', cover_image:'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=800&q=80', author_name:'Grace Wanjiku', read_time:7, created_at:'2024-09-22' },
  { id:'5', slug:'brand-content-strategy-social-media', title:'Building a Brand Content Strategy That Actually Works', excerpt:"Most brands post content. Smart brands tell stories. Here's how to build a content strategy with lasting impact.", category:'Branding', cover_image:'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&q=80', author_name:'Sarah Njeri', read_time:9, created_at:'2024-09-05' },
  { id:'6', slug:'behind-the-lens-nairobi-documentary', title:'Behind the Lens: Documenting Life in Nairobi', excerpt:"Our team spent 6 months documenting Nairobi's incredible transformation. Here's what we learned about urban storytelling.", category:'Documentary', cover_image:'https://images.unsplash.com/photo-1508444845599-5c89863b1c44?w=800&q=80', author_name:'Jason Mejia', read_time:12, created_at:'2024-08-18' },
];

const CATS = ['All','Weddings','Corporate','Events','Drone','Branding','Documentary'];

export default function BlogPage() {
  const [cat, setCat] = useState('All');
  const [posts, setPosts] = useState<Post[]>(FALLBACK);

  useEffect(() => {
    (async () => {
      try {
        const sb = createClient();
        const { data } = await sb
          .from('mejasan_blog_posts')
          .select('id,slug,title,excerpt,category,cover_image,author_name,read_time,created_at')
          .eq('is_published', true)
          .order('created_at', { ascending: false });
        if (data?.length) setPosts(data as Post[]);
      } catch { /* use fallback */ }
    })();
  }, []);

  const filtered = cat === 'All' ? posts : posts.filter(p => p.category === cat);
  const [featured, ...rest] = filtered;

  return (
    <div className="bg-[#F5F5F0] min-h-screen">
      {/* Header */}
      <div className="pt-32 pb-14 border-b border-[#0F0F0F]/[0.06]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16 text-center">
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="w-8 h-px bg-[#E10600]" />
            <span className="text-[11px] font-display font-semibold tracking-[0.3em] text-[#E10600] uppercase">Insights & Stories</span>
            <div className="w-8 h-px bg-[#E10600]" />
          </div>
          <h1 className="text-[clamp(3rem,8vw,8rem)] font-heading font-light text-[#0F0F0F] leading-[0.92] mb-5">
            The <em className="text-[#E10600] not-italic italic">Journal</em>
          </h1>
          <p className="text-base text-[#0F0F0F]/55 max-w-lg mx-auto">Industry insights, behind-the-scenes stories, and creative inspiration from the Mejasan team.</p>
        </div>
      </div>

      {/* Filter */}
      <div className="border-b border-[#0F0F0F]/[0.06] py-4 sticky top-[var(--navbar-height)] z-30 bg-[#F5F5F0]/95 backdrop-blur-xl">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16 flex gap-2 overflow-x-auto scrollbar-none" role="tablist" aria-label="Filter blog by category">
          {CATS.map((c) => (
            <button key={c} role="tab" aria-selected={cat === c} onClick={() => setCat(c)}
              className={`shrink-0 px-4 py-2 text-[11px] font-display font-semibold tracking-widest uppercase transition-all ${cat===c ? 'bg-[#E10600] text-white' : 'text-[#0F0F0F]/50 border border-[#0F0F0F]/[0.1] hover:text-[#0F0F0F]'}`}>
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16 py-16">
        {/* Featured post */}
        {featured && (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="mb-16">
            <Link href={`/blog/${featured.slug}`} className="group grid lg:grid-cols-2 gap-0.5">
              <div className="relative overflow-hidden h-64 sm:h-80 lg:h-[480px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={featured.cover_image} alt={featured.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="bg-white p-8 sm:p-10 lg:p-12 flex flex-col justify-center border border-[#0F0F0F]/[0.06]">
                <div className="text-[11px] font-display tracking-widest text-[#E10600] uppercase mb-4">{featured.category} · Featured</div>
                <h2 className="text-[clamp(1.5rem,3vw,2.5rem)] font-heading font-light text-[#0F0F0F] mb-4 leading-tight group-hover:text-[#0F0F0F]/70 transition-colors">{featured.title}</h2>
                <p className="text-[15px] text-[#0F0F0F]/55 leading-relaxed mb-6">{featured.excerpt}</p>
                <div className="flex items-center gap-4 text-[12px] text-[#0F0F0F]/55 font-display mb-6">
                  <span className="flex items-center gap-1.5"><Calendar size={11} />{new Date(featured.created_at).toLocaleDateString('en-KE',{year:'numeric',month:'short',day:'numeric'})}</span>
                  <span className="flex items-center gap-1.5"><Clock size={11} />{featured.read_time} min read</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] font-display tracking-widest uppercase text-[#E10600] group-hover:gap-3 transition-all">
                  Read Article <ArrowRight size={11} />
                </div>
              </div>
            </Link>
          </motion.div>
        )}

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-0.5">
          {rest.map((post, i) => (
            <motion.div key={post.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <Link href={`/blog/${post.slug}`} className="group block bg-white hover:shadow-md border border-[#0F0F0F]/[0.06] transition-all duration-300">
                <div className="relative overflow-hidden h-48 sm:h-56">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="p-5 sm:p-6">
                  <div className="text-[10px] font-display tracking-widest text-[#E10600] uppercase mb-2">{post.category}</div>
                  <h3 className="text-base font-heading font-light text-[#0F0F0F] mb-2 leading-snug group-hover:text-[#0F0F0F]/70 transition-colors line-clamp-2">{post.title}</h3>
                  <p className="text-[13px] text-[#0F0F0F]/50 line-clamp-2 leading-relaxed mb-4">{post.excerpt}</p>
                  <div className="flex items-center gap-3 text-[11px] text-[#0F0F0F]/55 font-display">
                    <span>{post.author_name}</span>
                    <span>·</span>
                    <span>{post.read_time} min</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center py-24 text-[#0F0F0F]/40 font-display text-sm">No posts in this category yet.</p>
        )}
      </div>
    </div>
  );
}
