import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email')?.trim().toLowerCase() || '';
  const date = searchParams.get('date')?.trim() || '';

  if (!email || !date) {
    return NextResponse.json({ duplicate: false });
  }

  const supabase = await createAdminClient();
  const { data, error } = await supabase
    .from('mejasan_wedding_intake')
    .select('id')
    .ilike('client_email', email)
    .eq('wedding_date', date)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    // Fail open — the client still lets the couple submit if the check errors.
    return NextResponse.json({ duplicate: false });
  }

  return NextResponse.json({ duplicate: !!data, id: data?.id ?? null });
}
