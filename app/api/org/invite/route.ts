import { NextRequest, NextResponse } from 'next/server';
import { adminClient } from '@/lib/supabase/admin';

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  const { data, error } = await adminClient.auth.admin.inviteUserByEmail(email);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ id: data.user?.id });
}
