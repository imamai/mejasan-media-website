import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

async function sendEmail(to: string, subject: string, html: string) {
  const key = process.env.RESEND_API_KEY;
  if (!key || key === 're_...') return; // not configured
  const from = `${process.env.RESEND_FROM_NAME ?? 'Mejasan Media'} <${process.env.RESEND_FROM_EMAIL ?? 'noreply@mejasanmedia.com'}>`;
  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from, to: [to], subject, html }),
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type, name, email, phone, subject, message, service, event_date, event_time, location, duration, budget, hear, first_name, last_name } = body;

    const supabase = await createAdminClient();

    if (type === 'booking') {
      const ref = `MJB-${Math.random().toString(36).substring(2,8).toUpperCase()}`;
      const { error } = await supabase.from('mejasan_bookings').insert({
        booking_ref:     ref,
        client_name:     `${first_name} ${last_name}`.trim(),
        client_email:    email,
        client_phone:    phone,
        service_type:    service,
        event_date:      event_date || null,
        event_time:      event_time || null,
        event_location:  location,
        duration:        duration || null,
        budget_range:    budget,
        heard_via:       hear || null,
        notes:           message,
        status:          'pending',
      });
      if (error) throw error;

      // Confirmation email to client
      await sendEmail(email, `Booking Enquiry Received — ${ref}`, `
        <h2>Thank you, ${first_name}!</h2>
        <p>We've received your booking enquiry for <strong>${service}</strong>.</p>
        <p>Your reference: <strong>${ref}</strong></p>
        <p>Our team will review your request and respond within 24 hours.</p>
        <p>— Mejasan Media Production</p>
      `);

      // Notification to admin
      await sendEmail('info@mejasanmedia.com', `New Booking: ${ref} — ${service}`, `
        <h3>New Booking Enquiry</h3>
        <p><strong>Ref:</strong> ${ref}</p>
        <p><strong>Client:</strong> ${first_name} ${last_name} (${email})</p>
        <p><strong>Service:</strong> ${service}</p>
        <p><strong>Date:</strong> ${event_date ?? 'TBD'}</p>
        <p><strong>Location:</strong> ${location}</p>
        <p><strong>Budget:</strong> ${budget}</p>
        <p><strong>Notes:</strong> ${message}</p>
      `);

      return NextResponse.json({ message: 'Booking received', booking_ref: ref });
    }

    // General contact form
    const { error } = await supabase.from('mejasan_contact_submissions').insert({
      name:    name ?? `${first_name ?? ''} ${last_name ?? ''}`.trim(),
      email,
      phone:   phone || null,
      subject: subject || service || 'Website Enquiry',
      message,
      status: 'new',
    });
    if (error) throw error;

    await sendEmail('info@mejasanmedia.com', `New Contact: ${subject}`, `
      <h3>New Contact Form Submission</h3>
      <p><strong>From:</strong> ${name} (${email})</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `);

    return NextResponse.json({ message: 'Message sent successfully' });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Submission failed';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
