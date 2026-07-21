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

export async function GET(req: Request) {
  try {
    const callerId = await getCallerId(req);
    if (!callerId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const admin = await createAdminClient();
    const { data: isAdmin } = await admin.rpc('mejasan_is_admin', { uid: callerId });
    if (!isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const [{ data: userList }, { data: profiles }, { data: projects }] = await Promise.all([
      admin.auth.admin.listUsers(),
      admin.from('mejasan_client_profiles').select('*'),
      admin.from('mejasan_projects').select('client_user_id'),
    ]);

    const profileByUser = new Map((profiles ?? []).map((p) => [p.user_id as string, p]));
    const projectCounts = new Map<string, number>();
    for (const p of projects ?? []) {
      const id = p.client_user_id as string | null;
      if (!id) continue;
      projectCounts.set(id, (projectCounts.get(id) ?? 0) + 1);
    }

    const clients = (userList?.users ?? [])
      .filter((u) => !(u.email ?? '').toLowerCase().endsWith('@mejasanmedia.com'))
      .map((u) => {
        const profile = profileByUser.get(u.id);
        return {
          id: u.id,
          name: (profile?.full_name as string) ?? (u.user_metadata?.full_name as string) ?? u.email ?? 'Unknown',
          email: u.email ?? '',
          phone: (profile?.phone as string) ?? '',
          company: (profile?.company as string) ?? '',
          projects: projectCounts.get(u.id) ?? 0,
          joined: u.created_at,
        };
      });

    return NextResponse.json(clients);
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Error' }, { status: 500 });
  }
}
