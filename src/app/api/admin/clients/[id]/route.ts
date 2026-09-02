import { NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';

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

    const { data: user } = await admin.auth.admin.getUserById(id);
    const email = user?.user?.email ?? '';

    const [bookings, projects, invoices, weddingIntake] = await Promise.all([
      admin.from('mejasan_bookings').select('id,reference,status,event_date').eq('client_user_id', id).order('created_at', { ascending: false }),
      admin.from('mejasan_projects').select('id,title,status,stage').eq('client_user_id', id).order('created_at', { ascending: false }),
      admin.from('mejasan_invoices').select('id,invoice_number,status,total_amount').eq('client_user_id', id).order('created_at', { ascending: false }),
      email
        ? admin.from('mejasan_wedding_intake').select('id,bride_name,groom_name,status,wedding_date').ilike('client_email', email).order('created_at', { ascending: false })
        : Promise.resolve({ data: [] as Record<string, unknown>[] }),
    ]);

    return NextResponse.json({
      bookings: bookings.data ?? [],
      projects: projects.data ?? [],
      invoices: invoices.data ?? [],
      weddingIntake: weddingIntake.data ?? [],
    });
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Error' }, { status: 500 });
  }
}
