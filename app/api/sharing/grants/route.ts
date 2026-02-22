import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireUser } from '@/lib/auth';

export async function GET() {
  const user = await requireUser();
  const supabase = await createClient();
  const { data: patient } = await supabase.from('patients').select('id').eq('user_id', user.id).single();
  const { data } = await supabase.from('access_grants').select('*').eq('patient_id', patient.id).order('created_at',{ascending:false});
  return NextResponse.json(data ?? []);
}
export async function POST(req: NextRequest) {
  const user = await requireUser();
  const supabase = await createClient();
  const body = await req.json();
  const { data: patient } = await supabase
    .from('patients')
    .select('id')
    .eq('user_id', user.id)
    .maybeSingle();

  if (!patient) return NextResponse.json({ error: 'patient_not_found' }, { status: 404 });

  await supabase.from('access_grants').insert({
    patient_id: patient.id,
    provider_user_id: body.providerUserId ?? user.id,
    scope: body.scope ?? 'READ',
    expires_at: body.expiresAt ?? null,
  });
  return NextResponse.json({ ok: true });
}
