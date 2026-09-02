import { NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';
import { renderInvoicePdf, type InvoiceData } from '@/lib/pdf/invoiceDocument';

const DOC_BUCKET = 'mejasan-event-docs';

async function getCallerId(req: Request) {
  const authHeader = req.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    const admin = await createAdminClient();
    const { data: { user } } = await admin.auth.getUser(authHeader.slice(7));
    return user?.id ?? null;
  }
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id ?? null;
}

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const callerId = await getCallerId(req);
    if (!callerId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const admin = await createAdminClient();
    const { data: isAdmin } = await admin.rpc('mejasan_is_admin', { uid: callerId });
    if (!isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { data: invoice, error } = await admin.from('mejasan_invoices').select('*').eq('id', id).maybeSingle();
    if (error || !invoice) return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });

    const pdf = await renderInvoicePdf(invoice as unknown as InvoiceData);
    const objectPath = `invoices/${id}.pdf`;
    const { error: upErr } = await admin.storage.from(DOC_BUCKET).upload(objectPath, pdf, { contentType: 'application/pdf', upsert: true });
    if (upErr) throw upErr;
    const pdfUrl = admin.storage.from(DOC_BUCKET).getPublicUrl(objectPath).data.publicUrl;
    await admin.from('mejasan_invoices').update({ pdf_url: pdfUrl }).eq('id', id);

    return NextResponse.redirect(pdfUrl, { status: 307 });
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Error' }, { status: 500 });
  }
}
