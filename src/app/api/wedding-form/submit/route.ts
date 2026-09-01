import { randomUUID } from 'node:crypto';
import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import {
  renderQuestionnairePdf,
  renderContractPdf,
  type WeddingQuestionnaireData,
  type WeddingContractData,
} from '@/lib/pdf/weddingDocuments';

const SIG_BUCKET = 'mejasan-media';
const DOC_BUCKET = 'mejasan-event-docs'; // allows application/pdf; mejasan-media is images/video only

interface SubmitBody {
  questionnaire: WeddingQuestionnaireData;
  contract: WeddingContractData;
  signatures: {
    client?: string | null;
    witness?: string | null;
    company?: string | null;
    companyWitness?: string | null;
  };
  is_correction: boolean;
  correction_of?: string | null;
}

async function sendEmail(to: string, subject: string, html: string, attachments: { filename: string; content: string }[]) {
  const key = process.env.RESEND_API_KEY;
  if (!key || key === 're_...') return;
  const from = `${process.env.RESEND_FROM_NAME ?? 'Mejasan Media'} <${process.env.RESEND_FROM_EMAIL ?? 'noreply@mejasanmedia.com'}>`;
  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from, to: [to], subject, html, attachments }),
  });
}

function dataUrlToBuffer(dataUrl: string | null | undefined): Buffer | null {
  if (!dataUrl || !dataUrl.startsWith('data:image')) return null;
  const base64 = dataUrl.split(',')[1];
  if (!base64) return null;
  return Buffer.from(base64, 'base64');
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as SubmitBody;
    const { questionnaire: q, contract: c, signatures, is_correction, correction_of } = body;

    if (!q?.bride_name || !q?.groom_name || !q?.wedding_date || !q?.client_email) {
      return NextResponse.json({ error: 'Missing required questionnaire fields' }, { status: 400 });
    }
    if (!c?.event_date || !c?.location || !c?.cost || !c?.client_name || !c?.client_phone) {
      return NextResponse.json({ error: 'Missing required contract fields' }, { status: 400 });
    }

    const supabase = await createAdminClient();
    const id = is_correction && correction_of ? correction_of : randomUUID();

    // Upload signatures
    const sigBuffers: Record<string, Buffer | null> = {
      client: dataUrlToBuffer(signatures?.client),
      witness: dataUrlToBuffer(signatures?.witness),
      company: dataUrlToBuffer(signatures?.company),
      companyWitness: dataUrlToBuffer(signatures?.companyWitness),
    };
    const sigUrls: Record<string, string | null> = { client: null, witness: null, company: null, companyWitness: null };
    for (const [key, buf] of Object.entries(sigBuffers)) {
      if (!buf) continue;
      const objectPath = `wedding-signatures/${id}/${key}.png`;
      const { error: upErr } = await supabase.storage.from(SIG_BUCKET).upload(objectPath, buf, {
        contentType: 'image/png',
        upsert: true,
      });
      if (upErr) throw upErr;
      sigUrls[key] = supabase.storage.from(SIG_BUCKET).getPublicUrl(objectPath).data.publicUrl;
    }

    const coupleLabel = `${q.bride_name} and ${q.groom_name}`;
    const generatedDate = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

    const questionnairePdf = await renderQuestionnairePdf(q);
    const contractPdf = await renderContractPdf(c, coupleLabel, sigUrls, generatedDate);

    const qPath = `wedding-documents/${id}/questionnaire.pdf`;
    const cPath = `wedding-documents/${id}/contract.pdf`;
    const [{ error: qErr }, { error: cErr }] = await Promise.all([
      supabase.storage.from(DOC_BUCKET).upload(qPath, questionnairePdf, { contentType: 'application/pdf', upsert: true }),
      supabase.storage.from(DOC_BUCKET).upload(cPath, contractPdf, { contentType: 'application/pdf', upsert: true }),
    ]);
    if (qErr) throw qErr;
    if (cErr) throw cErr;

    const questionnairePdfUrl = supabase.storage.from(DOC_BUCKET).getPublicUrl(qPath).data.publicUrl;
    const contractPdfUrl = supabase.storage.from(DOC_BUCKET).getPublicUrl(cPath).data.publicUrl;

    const row = {
      id,
      status: 'submitted' as const,
      bride_name: q.bride_name,
      groom_name: q.groom_name,
      wedding_date: q.wedding_date,
      client_email: q.client_email,
      client_phone: c.client_phone,
      questionnaire: q,
      contract: c,
      signature_client_url: sigUrls.client,
      signature_witness_url: sigUrls.witness,
      signature_company_url: sigUrls.company,
      signature_company_witness_url: sigUrls.companyWitness,
      questionnaire_pdf_url: questionnairePdfUrl,
      contract_pdf_url: contractPdfUrl,
      is_correction: !!is_correction,
      correction_of: is_correction ? correction_of ?? null : null,
      updated_at: new Date().toISOString(),
    };

    const { error: dbErr } = is_correction && correction_of
      ? await supabase.from('mejasan_wedding_intake').update(row).eq('id', id)
      : await supabase.from('mejasan_wedding_intake').insert(row);
    if (dbErr) throw dbErr;

    const attachments = [
      { filename: `Questionnaire — ${coupleLabel} — ${q.wedding_date}.pdf`, content: questionnairePdf.toString('base64') },
      { filename: `Contract — ${coupleLabel} — ${q.wedding_date}.pdf`, content: contractPdf.toString('base64') },
    ];

    const clientSubject = is_correction
      ? `Your updated wedding booking — ${coupleLabel}`
      : `Your wedding booking is confirmed — ${coupleLabel}`;
    await sendEmail(q.client_email, clientSubject, `
      <h2>Thank you, ${q.bride_name} &amp; ${q.groom_name}!</h2>
      <p>${is_correction ? 'Your booking has been updated.' : 'We\'ve received your wedding questionnaire and signed contract.'}</p>
      <p>Your Questionnaire and Contract are attached as PDFs for your records.</p>
      <p>We look forward to telling your story beautifully.</p>
      <p>— Mejasan Media Production</p>
    `, attachments);

    await sendEmail('info@mejasanmedia.com', `${is_correction ? 'Updated' : 'New'} wedding intake — ${coupleLabel} (${q.wedding_date})`, `
      <h3>${is_correction ? 'Updated' : 'New'} Wedding Intake Submission</h3>
      <p><strong>Couple:</strong> ${coupleLabel}</p>
      <p><strong>Wedding date:</strong> ${q.wedding_date}</p>
      <p><strong>Client email:</strong> ${q.client_email}</p>
      <p><strong>Client phone:</strong> ${c.client_phone}</p>
      <p><strong>Package:</strong> ${q.selected_package || '—'}</p>
      <p><strong>Total cost:</strong> KES ${c.cost}</p>
      <p>Full questionnaire and signed contract are attached, and reviewable in the admin dashboard under Wedding Forms.</p>
    `, attachments);

    return NextResponse.json({ ok: true, id, questionnaire_pdf_url: questionnairePdfUrl, contract_pdf_url: contractPdfUrl });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Submission failed';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
