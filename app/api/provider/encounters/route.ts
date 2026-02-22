import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireUser } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const user = await requireUser();
  const body = await req.json();
  const supabase = await createClient();
  const { data: grant } = await supabase
    .from('access_grants')
    .select('*')
    .eq('patient_id', body.patientId)
    .eq('provider_user_id', user.id)
    .is('revoked_at', null)
    .maybeSingle();

  if (!grant || grant.scope !== 'READ_WRITE') return NextResponse.json({ error: 'forbidden' }, { status: 403 });

  const { data, error } = await supabase
    .from('encounters')
    .insert({
      patient_id: body.patientId,
      provider_user_id: user.id,
      occurred_at: new Date().toISOString(),
      reason: body.reason,
      diagnosis_text: body.diagnosisText ?? null,
      notes: body.notes ?? null,
    })
    .select()
    .maybeSingle();

  if (error || !data) return NextResponse.json({ error: error?.message ?? 'create_failed' }, { status: 400 });
  return NextResponse.json(data);
}
