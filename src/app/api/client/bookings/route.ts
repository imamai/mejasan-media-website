import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/server';

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    let userEmail: string | null = null;

    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.slice(7);
      const admin = await createAdminClient();
      const { data: { user } } = await admin.auth.getUser(token);
      userEmail = user?.email ?? null;
    } else {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();
      userEmail = user?.email ?? null;
    }

    if (!userEmail) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const admin = await createAdminClient();
    const { data, error } = await admin
      .from('mejasan_bookings')
      .select('*')
      .eq('client_email', userEmail)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json(data ?? []);
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Error' }, { status: 500 });
  }
}
