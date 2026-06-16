import type { MetadataRoute } from 'next';

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://mejasanmedia.com';

const STATIC: MetadataRoute.Sitemap = [
  { url: `${SITE}`,                       lastModified: new Date(), changeFrequency: 'weekly',  priority: 1.0 },
  { url: `${SITE}/about`,                 lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
  { url: `${SITE}/portfolio`,             lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.9 },
  { url: `${SITE}/services/photography`,  lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
  { url: `${SITE}/services/videography`,  lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
  { url: `${SITE}/services/events`,       lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
  { url: `${SITE}/services/drone`,        lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
  { url: `${SITE}/services/branding`,     lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
  { url: `${SITE}/blog`,                  lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.7 },
  { url: `${SITE}/booking`,               lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
  { url: `${SITE}/contact`,               lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
  { url: `${SITE}/privacy`,               lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.3 },
  { url: `${SITE}/terms`,                 lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.3 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let blogPosts: { url: string; lastModified: Date; changeFrequency: 'weekly'; priority: number }[] = [];

  try {
    const { createClient } = await import('@supabase/supabase-js');
    const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
    const { data } = await sb.from('mejasan_blog_posts').select('slug,updated_at').eq('is_published', true);
    if (data) {
      blogPosts = data.map((p: { slug: string; updated_at: string }) => ({
        url: `${SITE}/blog/${p.slug}`,
        lastModified: new Date(p.updated_at),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      }));
    }
  } catch { /* fallback to static only */ }

  return [...STATIC, ...blogPosts];
}
