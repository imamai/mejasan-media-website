import { NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';
import { renderContractPdf, type WeddingContractData, type WeddingQuestionnaireData } from '@/lib/pdf/weddingDocuments';
import { sendEmail, MEJASAN_ADMIN_EMAIL } from '@/lib/email';

const DOC_BUCKET = 'mejasan-event-docs';

async function getCaller(req: Request) {
  const authHeader = req.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    const admin = await createAdminClient();
    const { data: { user } } = await admin.auth.getUser(authHeader.slice(7));
    return user;
  }
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

interface PatchBody {
  bride_name?: string;
  groom_name?: string;
  wedding_date?: string;
  client_email?: string;
  client_phone?: string;
  questionnaire?: Partial<WeddingQuestionnaireData>;
  contract?: Partial<WeddingContractData>;
  invoice_number?: string;
  company_signoff_name?: string;
  company_signoff_title?: string;
  status?: string;
  finalize?: boolean;
  sendDraft?: boolean;
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const caller = await getCaller(req);
    if (!caller) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const admin = await createAdminClient();
    const { data: isAdmin } = await admin.rpc('mejasan_is_admin', { uid: caller.id });
    if (!isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { data: row, error: loadErr } = await admin.from('mejasan_wedding_intake').select('*').eq('id', id).maybeSingle();
    if (loadErr || !row) return NextResponse.json({ error: 'Submission not found' }, { status: 404 });

    const body = (await req.json()) as PatchBody;

    const mergedQuestionnaire: WeddingQuestionnaireData = { ...(row.questionnaire ?? {}), ...(body.questionnaire ?? {}) };
    const mergedContract: WeddingContractData = { ...(row.contract ?? {}), ...(body.contract ?? {}) };

    const baseUpdates: Record<string, unknown> = {
      questionnaire: mergedQuestionnaire,
      contract: mergedContract,
      updated_at: new Date().toISOString(),
    };
    if (body.bride_name !== undefined) baseUpdates.bride_name = body.bride_name;
    if (body.groom_name !== undefined) baseUpdates.groom_name = body.groom_name;
    if (body.wedding_date !== undefined) baseUpdates.wedding_date = body.wedding_date;
    if (body.client_email !== undefined) baseUpdates.client_email = body.client_email;
    if (body.client_phone !== undefined) baseUpdates.client_phone = body.client_phone;
    if (body.invoice_number !== undefined) baseUpdates.invoice_number = body.invoice_number;
    if (body.company_signoff_name !== undefined) baseUpdates.company_signoff_name = body.company_signoff_name;
    if (body.company_signoff_title !== undefined) baseUpdates.company_signoff_title = body.company_signoff_title;

    if (body.sendDraft) {
      // Send an in-progress copy for the client to review during back-and-forth
      // revisions. No validation gate, no company signatures/review stamp (those
      // are exclusively finalize's job), and nothing marked as reviewed/signed —
      // this can be sent as many times as needed while terms are still settling.
      const { data: updated, error: updErr } = await admin.from('mejasan_wedding_intake').update(baseUpdates).eq('id', id).select().single();
      if (updErr) throw updErr;

      const draftGeneratedDate = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
      const draftCoupleLabel = `${body.bride_name ?? row.bride_name} and ${body.groom_name ?? row.groom_name}`;
      const draftPdf = await renderContractPdf(mergedContract, draftCoupleLabel, {
        client: row.signature_client_url,
        witness: row.signature_witness_url,
        company: null,
        companyWitness: null,
      }, draftGeneratedDate, {
        invoiceNumber: body.invoice_number ?? row.invoice_number,
        companySignoff: null,
      });

      const clientEmail = (body.client_email ?? row.client_email) as string;
      await sendEmail(clientEmail, `Draft contract for your review — ${draftCoupleLabel}`, `
        <h2>Hello ${body.bride_name ?? row.bride_name} &amp; ${body.groom_name ?? row.groom_name},</h2>
        <p>Attached is a draft of your wedding contract reflecting the latest details discussed with Mejasan Media Production.</p>
        <p>Please review the terms and let us know if any changes are needed. This is <strong>not yet the final signed copy</strong> — once everything is confirmed, we'll send the fully signed version separately.</p>
        <p>— Mejasan Media Production</p>
      `, [{ filename: `Draft Contract — ${draftCoupleLabel} — ${mergedContract.event_date}.pdf`, content: draftPdf.toString('base64') }], { cc: MEJASAN_ADMIN_EMAIL });

      return NextResponse.json({ ok: true, item: updated });
    }

    if (!body.finalize) {
      // Plain edit (and/or a manual status change, e.g. reverting a reviewed
      // submission back to 'submitted' for correction) — no PDF/email side effects.
      if (body.status !== undefined) baseUpdates.status = body.status;
      const { data: updated, error: updErr } = await admin.from('mejasan_wedding_intake').update(baseUpdates).eq('id', id).select().single();
      if (updErr) throw updErr;
      return NextResponse.json({ ok: true, item: updated });
    }

    // Finalizing: validate everything required for a signed, sendable contract exists.
    const { data: signoffSettings } = await admin
      .from('mejasan_settings')
      .select('key,value')
      .in('key', ['company_rep_signature_url', 'company_witness_signature_url', 'company_signoff_name', 'company_signoff_title']);
    const settingsMap = Object.fromEntries((signoffSettings ?? []).map((s) => [s.key, s.value]));

    const invoiceNumber = (body.invoice_number ?? row.invoice_number ?? '').toString().trim();
    const signoffName = (body.company_signoff_name ?? row.company_signoff_name ?? settingsMap.company_signoff_name ?? '').toString().trim();
    const signoffTitle = (body.company_signoff_title ?? row.company_signoff_title ?? settingsMap.company_signoff_title ?? '').toString().trim();

    const missing: string[] = [];
    if (!invoiceNumber) missing.push('Invoice Number');
    if (!signoffName) missing.push('Mejasan Media sign-off name');
    if (!mergedContract.event_date) missing.push('Event Date');
    if (!mergedContract.location) missing.push('Location');
    if (!mergedContract.cost) missing.push('Total Cost');
    if (!mergedContract.client_name) missing.push('Client Name');
    if (!mergedContract.client_phone) missing.push('Client Phone');
    if (!/^yes/i.test(mergedContract.media_consent || '') && !/^no/i.test(mergedContract.media_consent || '')) {
      missing.push('Copyright & Consent to Share answer');
    }
    if (!row.signature_client_url) missing.push("Client's signature");

    // Company Rep / Witness (Company) always use the canonical Settings image when one is
    // configured — the public client-facing form's canvas for these two boxes marks itself
    // "signed" on the first touch/click even without an actual stroke, so a per-record value
    // there can be a blank accidental capture rather than a real signature.
    const effectiveCompanyUrl: string | null = settingsMap.company_rep_signature_url || row.signature_company_url || null;
    const effectiveCompanyWitnessUrl: string | null = settingsMap.company_witness_signature_url || row.signature_company_witness_url || null;

    if (!effectiveCompanyUrl) missing.push('Company Rep signature not configured — upload it in Settings first');
    if (!effectiveCompanyWitnessUrl) missing.push('Witness (Company) signature not configured — upload it in Settings first');

    if (missing.length) {
      return NextResponse.json({ error: 'Cannot mark as reviewed — required information is missing.', missing }, { status: 400 });
    }

    const nowIso = new Date().toISOString();
    const generatedDate = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    const coupleLabel = `${body.bride_name ?? row.bride_name} and ${body.groom_name ?? row.groom_name}`;

    const sigUrls = {
      client: row.signature_client_url,
      witness: row.signature_witness_url,
      company: effectiveCompanyUrl,
      companyWitness: effectiveCompanyWitnessUrl,
    };

    const contractPdf = await renderContractPdf(mergedContract, coupleLabel, sigUrls, generatedDate, {
      invoiceNumber,
      companySignoff: { name: signoffName, title: signoffTitle, date: generatedDate },
    });

    const objectPath = `wedding-documents/${id}/contract-signed.pdf`;
    const { error: upErr } = await admin.storage.from(DOC_BUCKET).upload(objectPath, contractPdf, { contentType: 'application/pdf', upsert: true });
    if (upErr) throw upErr;
    const signedContractPdfUrl = admin.storage.from(DOC_BUCKET).getPublicUrl(objectPath).data.publicUrl;

    const finalUpdates: Record<string, unknown> = {
      ...baseUpdates,
      invoice_number: invoiceNumber,
      company_signoff_name: signoffName,
      company_signoff_title: signoffTitle,
      company_signoff_at: nowIso,
      reviewed_by: caller.email ?? caller.id,
      reviewed_at: nowIso,
      signature_company_url: effectiveCompanyUrl,
      signature_company_witness_url: effectiveCompanyWitnessUrl,
      signed_contract_pdf_url: signedContractPdfUrl,
      client_notified_at: nowIso,
      status: 'reviewed',
    };

    const { data: updated, error: updErr } = await admin.from('mejasan_wedding_intake').update(finalUpdates).eq('id', id).select().single();
    if (updErr) throw updErr;

    const clientEmail = (body.client_email ?? row.client_email) as string;
    const attachments = [{ filename: `Signed Contract — ${coupleLabel} — ${mergedContract.event_date}.pdf`, content: contractPdf.toString('base64') }];

    await sendEmail(clientEmail, `Your signed wedding contract — ${coupleLabel}`, `
      <h2>Hello ${body.bride_name ?? row.bride_name} &amp; ${body.groom_name ?? row.groom_name},</h2>
      <p>Your wedding contract has been reviewed and formally approved by Mejasan Media Production.</p>
      <p>The full signed copy is attached as a PDF for your records${invoiceNumber ? ` (Invoice/Quote No: ${invoiceNumber})` : ''}.</p>
      <p>Approved by: ${signoffName}${signoffTitle ? `, ${signoffTitle}` : ''}</p>
      <p>— Mejasan Media Production</p>
    `, attachments, { cc: MEJASAN_ADMIN_EMAIL });

    return NextResponse.json({ ok: true, item: updated });
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Update failed' }, { status: 500 });
  }
}
