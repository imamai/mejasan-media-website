import { createClient } from '@/lib/supabase/server';
import { getPageContent, type ContactContent } from '@/lib/page-content-schema';
import ContactClient from './ContactClient';

export default async function ContactPage() {
  const sb = await createClient();
  const { data } = await sb.from('mejasan_page_content').select('content').eq('page_slug', 'contact').maybeSingle();
  const content = getPageContent('contact', data?.content) as ContactContent;

  return <ContactClient content={content} />;
}
