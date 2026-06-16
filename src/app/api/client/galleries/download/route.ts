import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const galleryId = searchParams.get('id');
    const authHeader = req.headers.get('authorization');

    if (!galleryId) return NextResponse.json({ error: 'Gallery ID required' }, { status: 400 });

    let userId: string | null = null;
    if (authHeader?.startsWith('Bearer ')) {
      const admin = await createAdminClient();
      const { data: { user } } = await admin.auth.getUser(authHeader.slice(7));
      userId = user?.id ?? null;
    }

    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const admin = await createAdminClient();
    const { data: gallery } = await admin
      .from('mejasan_galleries')
      .select('client_user_id, gallery_images(url)')
      .eq('id', galleryId)
      .single();

    if (!gallery || gallery.client_user_id !== userId) {
      return NextResponse.json({ error: 'Gallery not found or access denied' }, { status: 403 });
    }

    const urls = (gallery.gallery_images as { url: string }[]).map((i) => i.url);
    return NextResponse.json({ urls });
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Error' }, { status: 500 });
  }
}
