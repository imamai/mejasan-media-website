import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email and password are required.' }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters.' }, { status: 400 });
    }

    const supabase = await createAdminClient();

    const { data: existing } = await supabase.auth.admin.listUsers();
    if (existing?.users?.some((u: { email?: string }) => u.email === email)) {
      return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 409 });
    }

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { full_name: name },
      email_confirm: true,
    });

    if (error) throw error;

    await supabase.from('mejasan_client_profiles').insert({
      user_id:    data.user.id,
      email:      email,
      full_name:  name,
    });

    return NextResponse.json({ message: 'Account created successfully.' }, { status: 201 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Signup failed';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
