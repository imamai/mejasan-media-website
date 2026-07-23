import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { createAdminClient } from '@/lib/supabase/server';
import EventDocumentFilesViewer, { type EventDocFile } from '@/components/EventDocumentFilesViewer';

/** iOS Safari (including the mini-browser the Camera app opens for QR links)
 *  has excellent native inline PDF support and handles large embedded images
 *  fine. The pdf.js/canvas renderer below exists for browsers that DON'T
 *  (Android Chrome), but forcing it on iOS too was causing embedded images
 *  to render partially — so iOS gets the native path instead. */
async function isIOSRequest(): Promise<boolean> {
  const h = await headers();
  const ua = h.get('user-agent') ?? '';
  return /iPhone|iPad|iPod/i.test(ua);
}

interface Params { params: Promise<{ token: string }> }

async function loadDocument(token: string) {
  const sb = await createAdminClient();
  const { data: row } = await sb
    .from('mejasan_event_documents')
    .select('*, mejasan_event_document_files(*)')
    .eq('access_token', token)
    .eq('is_active', true)
    .order('sort_order', { referencedTable: 'mejasan_event_document_files' })
    .maybeSingle();
  if (!row) return null;
  await sb.from('mejasan_event_documents').update({ view_count: (row.view_count as number ?? 0) + 1 }).eq('id', row.id as string);

  const childFiles = (row.mejasan_event_document_files as { url: string; name: string; type: string | null }[] | null) ?? [];
  const files: EventDocFile[] = childFiles.length > 0
    ? childFiles.map((f) => ({ url: f.url, name: f.name, type: f.type }))
    : (row.file_url ? [{ url: row.file_url as string, name: (row.file_name as string) ?? 'document', type: row.file_type as string | null }] : []);

  return {
    event_name: row.event_name as string,
    description: row.description as string | null,
    files,
  };
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { token } = await params;
  const doc = await loadDocument(token);
  return { title: doc ? doc.event_name : 'Document not found' };
}

export default async function EventDocumentPage({ params }: Params) {
  const { token } = await params;
  const doc = await loadDocument(token);

  if (!doc || doc.files.length === 0) {
    return (
      <div className="min-h-screen bg-[#0B0B0B] flex items-center justify-center px-4 text-center pt-[var(--navbar-height)]">
        <div>
          <h1 className="text-2xl font-heading font-light text-white mb-2">Document Unavailable</h1>
          <p className="text-white/40 text-sm font-display">This link is invalid or is no longer active. Please contact Mejasan Media Production for assistance.</p>
        </div>
      </div>
    );
  }

  const isIOS = await isIOSRequest();

  return (
    <div className="event-doc-viewport mt-[var(--navbar-height)] bg-[#0B0B0B] flex flex-col overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 px-3 sm:px-6 py-2.5 sm:py-3 border-b border-white/[0.08] shrink-0">
        <div className="min-w-0 max-w-full">
          <div className="text-[13px] sm:text-[15px] font-heading font-light text-white truncate">{doc.event_name}</div>
          {doc.description && <div className="text-[10px] sm:text-[11px] text-white/40 font-display truncate">{doc.description}</div>}
        </div>
      </div>

      <div className="flex-1 min-h-0">
        <EventDocumentFilesViewer files={doc.files} isIOS={isIOS} />
      </div>
    </div>
  );
}
