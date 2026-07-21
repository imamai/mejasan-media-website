import type { Metadata } from 'next';
import { Download } from 'lucide-react';
import { createAdminClient } from '@/lib/supabase/server';
import EventDocumentViewer from '@/components/EventDocumentViewer';

interface Params { params: Promise<{ token: string }> }

async function loadDocument(token: string) {
  const sb = await createAdminClient();
  const { data: row } = await sb
    .from('mejasan_event_documents')
    .select('*')
    .eq('access_token', token)
    .eq('is_active', true)
    .maybeSingle();
  if (!row) return null;
  await sb.from('mejasan_event_documents').update({ view_count: (row.view_count as number ?? 0) + 1 }).eq('id', row.id as string);
  return row as { event_name: string; description: string | null; file_url: string; file_name: string | null; file_type: string | null };
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { token } = await params;
  const doc = await loadDocument(token);
  return { title: doc ? doc.event_name : 'Document not found' };
}

export default async function EventDocumentPage({ params }: Params) {
  const { token } = await params;
  const doc = await loadDocument(token);

  if (!doc) {
    return (
      <div className="min-h-screen bg-[#0B0B0B] flex items-center justify-center px-4 text-center pt-[var(--navbar-height)]">
        <div>
          <h1 className="text-2xl font-heading font-light text-white mb-2">Document Unavailable</h1>
          <p className="text-white/40 text-sm font-display">This link is invalid or is no longer active. Please contact Mejasan Media Production for assistance.</p>
        </div>
      </div>
    );
  }

  const isImage = (doc.file_type ?? '').startsWith('image/');
  const isPdf = (doc.file_type ?? '') === 'application/pdf';

  return (
    <div className="h-[calc(100vh-var(--navbar-height))] mt-[var(--navbar-height)] bg-[#0B0B0B] flex flex-col overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 px-3 sm:px-6 py-2.5 sm:py-3 border-b border-white/[0.08] shrink-0">
        <div className="min-w-0 max-w-full">
          <div className="text-[13px] sm:text-[15px] font-heading font-light text-white truncate">{doc.event_name}</div>
          {doc.description && <div className="text-[10px] sm:text-[11px] text-white/40 font-display truncate">{doc.description}</div>}
        </div>
        <a
          href={doc.file_url}
          download={doc.file_name ?? undefined}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-[9px] sm:text-[10px] font-display tracking-widest uppercase text-white/60 hover:text-white border border-white/[0.12] px-2.5 sm:px-3 py-1.5 sm:py-2 shrink-0 transition-colors"
        >
          <Download size={11} className="shrink-0" /> <span className="hidden sm:inline">Download</span>
        </a>
      </div>

      <div className="flex-1 min-h-0">
        {isImage ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={doc.file_url} alt={doc.event_name} className="w-full h-full object-contain bg-[#0B0B0B]" />
        ) : isPdf ? (
          <EventDocumentViewer fileUrl={doc.file_url} fileName={doc.file_name} />
        ) : (
          <div className="flex items-center justify-center h-full px-4 text-center">
            <p className="text-white/60 text-sm font-display">
              This file type can&apos;t be previewed here.{' '}
              <a href={doc.file_url} download={doc.file_name ?? undefined} className="text-[#E10600] hover:underline">Download it instead</a>.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
