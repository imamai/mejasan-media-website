import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { getPageContent, type VideographyContent } from '@/lib/page-content-schema';
import VideographyClient from './VideographyClient';

export const metadata: Metadata = {
  title: 'Videography Services',
  description: 'Wedding films, corporate videos, documentaries, and commercial video production in Kenya.',
};

export default async function VideographyPage() {
  const sb = await createClient();
  const { data } = await sb.from('mejasan_page_content').select('content').eq('page_slug', 'services-videography').maybeSingle();
  const content = getPageContent('services-videography', data?.content) as VideographyContent;

  return <VideographyClient content={content} />;
}
