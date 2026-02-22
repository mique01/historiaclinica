import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(_: Request, { params }: { params: Promise<{ grantId: string }> }) {
  const { grantId } = await params;
  const supabase = await createClient();
  await supabase.from('access_grants').update({ revoked_at: new Date().toISOString() }).eq('id', grantId);
  return NextResponse.json({ ok: true });
}
