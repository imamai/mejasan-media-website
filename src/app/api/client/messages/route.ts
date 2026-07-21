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

async function ownsProject(projectId: string, userId: string) {
  const admin = await createAdminClient();
  const { data } = await admin.from('mejasan_projects').select('id').eq('id', projectId).eq('client_user_id', userId).maybeSingle();
  return !!data;
}

export async function GET(req: Request) {
  try {
    const user = await getCaller(req);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get('project_id');
    if (!projectId) return NextResponse.json({ error: 'project_id is required' }, { status: 400 });
    if (!(await ownsProject(projectId, user.id))) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const admin = await createAdminClient();
    const { data, error } = await admin
      .from('mejasan_messages')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return NextResponse.json(data ?? []);
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCaller(req);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { project_id, content } = await req.json();
    if (!project_id || !content?.trim()) return NextResponse.json({ error: 'project_id and content are required' }, { status: 400 });
    if (!(await ownsProject(project_id, user.id))) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const admin = await createAdminClient();
    const { data, error } = await admin
      .from('mejasan_messages')
      .insert({
        project_id,
        sender_id: user.id,
        sender_name: (user.user_metadata?.full_name as string) ?? user.email ?? 'Client',
        is_admin: false,
        content: content.trim(),
      })
      .select()
      .single();

    if (error) throw error;

    const { data: project } = await admin.from('mejasan_projects').select('title').eq('id', project_id).maybeSingle();
    const { data: admins } = await admin.from('mejasan_roles').select('user_id').eq('role', 'admin');
    if (admins?.length) {
      await admin.from('mejasan_notifications').insert(
        admins.map((a) => ({
          user_id: a.user_id,
          type: 'message',
          title: 'New client message',
          body: `${data.sender_name}: ${content.trim().slice(0, 140)}`,
          link: '/admin',
        }))
      );
    }

    return NextResponse.json({ ...data, project_title: project?.title ?? null });
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Error' }, { status: 500 });
  }
}
