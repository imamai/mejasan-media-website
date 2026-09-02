import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { getPageContent, type LegalContent } from '@/lib/page-content-schema';

export const metadata: Metadata = { title: 'Privacy Policy', description: 'Mejasan Media Production privacy policy.' };

export default async function PrivacyPage() {
  const sb = await createClient();
  const { data } = await sb.from('mejasan_page_content').select('content').eq('page_slug', 'privacy').maybeSingle();
  const { lastUpdated, sections } = getPageContent('privacy', data?.content) as LegalContent;

  return (
    <div className="bg-[#0B0B0B] pt-32 pb-20">
      <div className="max-w-[800px] mx-auto px-4 sm:px-8">
        <div className="flex items-center gap-3 mb-4"><div className="w-8 h-px bg-[#E10600]" /><span className="text-[10px] font-display font-semibold tracking-[0.3em] text-[#E10600] uppercase">Legal</span></div>
        <h1 className="text-5xl font-heading font-light text-white mb-4">Privacy Policy</h1>
        <p className="text-white/55 font-display text-sm mb-12">Last updated: {lastUpdated}</p>
        <div className="prose prose-invert max-w-none prose-headings:font-heading prose-headings:font-light prose-p:text-white/65 prose-p:leading-relaxed prose-h2:text-3xl prose-h3:text-xl">
          {sections.map((s) => (
            <div key={s.heading}>
              <h2>{s.heading}</h2>
              <p>{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
