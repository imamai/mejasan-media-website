import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { getPageContent, type VideographyContent, type PhotographyContent } from '@/lib/page-content-schema';
import VideographyClient from './VideographyClient';

export const metadata: Metadata = {
  title: 'Videography Services',
  description: 'Wedding films, corporate videos, documentaries, and commercial video production in Kenya.',
};

export default async function VideographyPage() {
  const sb = await createClient();
  const [videographyRow, photographyRow] = await Promise.all([
    sb.from('mejasan_page_content').select('content').eq('page_slug', 'services-videography').maybeSingle(),
    sb.from('mejasan_page_content').select('content').eq('page_slug', 'services-photography').maybeSingle(),
  ]);
  const content = getPageContent('services-videography', videographyRow.data?.content) as VideographyContent;
  // The wedding packages bundle videographers too, so they're edited once
  // (under Photography in the admin Pages tab) and shown on both pages.
  const { traditionalWeddingPackages, weddingQuotation } = getPageContent('services-photography', photographyRow.data?.content) as PhotographyContent;

  return <VideographyClient content={content} traditionalWeddingPackages={traditionalWeddingPackages} weddingQuotation={weddingQuotation} />;
}
