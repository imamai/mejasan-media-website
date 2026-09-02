import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { getPageContent, type BookingContent } from '@/lib/page-content-schema';
import BookingClient from './BookingClient';

export const metadata: Metadata = {
  title: 'Book a Session',
  description: 'Book a photography, videography, event, drone, or branding session with Mejasan Media Production.',
};

export default async function BookingPage() {
  const sb = await createClient();
  const { data } = await sb.from('mejasan_page_content').select('content').eq('page_slug', 'booking').maybeSingle();
  const content = getPageContent('booking', data?.content) as BookingContent;
  return <BookingClient content={content} />;
}
