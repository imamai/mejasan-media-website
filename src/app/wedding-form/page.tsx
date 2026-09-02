import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { getPageContent, type WeddingFormOptionsContent } from '@/lib/page-content-schema';
import WeddingFormClient from './WeddingFormClient';

export const metadata: Metadata = {
  title: 'Wedding Questionnaire & Contract',
  description: 'Complete your wedding media planning questionnaire, review the interview guide, and sign your contract with Mejasan Media Production.',
};

export default async function WeddingFormPage() {
  const sb = await createClient();
  const { data } = await sb.from('mejasan_page_content').select('content').eq('page_slug', 'wedding-form').maybeSingle();
  const content = getPageContent('wedding-form', data?.content) as WeddingFormOptionsContent;
  return <WeddingFormClient content={content} />;
}
