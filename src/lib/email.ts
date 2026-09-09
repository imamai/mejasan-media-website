export interface EmailAttachment {
  filename: string;
  content: string; // base64
}

export async function sendEmail(
  to: string,
  subject: string,
  html: string,
  attachments: EmailAttachment[] = [],
  options?: { cc?: string | string[] }
): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  if (!key || key === 're_...') return;
  const from = `${process.env.RESEND_FROM_NAME ?? 'Mejasan Media'} <${process.env.RESEND_FROM_EMAIL ?? 'noreply@edoscentre.co.ke'}>`;
  const replyTo = process.env.RESEND_REPLY_TO ?? 'info@mejasanmedia.com';
  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from, to: [to], cc: options?.cc, reply_to: replyTo, subject, html, attachments }),
  });
}

export const MEJASAN_ADMIN_EMAIL = 'info@mejasanmedia.com';
