import { NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';

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

async function requireAdmin(req: Request) {
  const user = await getCaller(req);
  if (!user) return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
  const admin = await createAdminClient();
  const { data: isAdmin } = await admin.rpc('mejasan_is_admin', { uid: user.id });
  if (!isAdmin) return { error: NextResponse.json({ error: 'Forbidden' }, { status: 403 }) };
  return { user };
}

export async function GET(req: Request) {
  try {
    const { user, error } = await requireAdmin(req);
    if (error) return error;

    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get('project_id');

    const admin = await createAdminClient();
    let query = admin.from('mejasan_messages').select('*').order('created_at', { ascending: true });
    if (projectId) query = query.eq('project_id', projectId);
    const { data, error: qError } = await query;
    if (qError) throw qError;
    return NextResponse.json(data ?? []);
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { user, error } = await requireAdmin(req);
    if (error) return error;

    const { project_id, content } = await req.json();
    if (!project_id || !content?.trim()) return NextResponse.json({ error: 'project_id and content are required' }, { status: 400 });

    const admin = await createAdminClient();
    const { data, error: insertError } = await admin
      .from('mejasan_messages')
      .insert({
        project_id,
        sender_id: user!.id,
        sender_name: 'Mejasan Team',
        is_admin: true,
        content: content.trim(),
      })
      .select()
      .single();
    if (insertError) throw insertError;

    const { data: project } = await admin.from('mejasan_projects').select('client_user_id').eq('id', project_id).maybeSingle();
    if (project?.client_user_id) {
      await admin.from('mejasan_notifications').insert({
        user_id: project.client_user_id,
        type: 'message',
        title: 'New message from Mejasan',
        body: content.trim().slice(0, 140),
        link: '/client-portal',
      });
    }

    return NextResponse.json(data);
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Error' }, { status: 500 });
  }
}
