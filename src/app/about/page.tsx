import { createClient } from '@/lib/supabase/server';
import { getPageContent, type AboutContent } from '@/lib/page-content-schema';
import AboutClient from './AboutClient';

export default async function AboutPage() {
  const sb = await createClient();
  const { data } = await sb.from('mejasan_page_content').select('content').eq('page_slug', 'about').maybeSingle();
  const content = getPageContent('about', data?.content) as AboutContent;

  return <AboutClient content={content} />;
}
