import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireUser } from '@/lib/auth';
import { getPatientIdForUser } from '@/lib/patient';

export async function GET() {
  const user = await requireUser();
  const patientId = await getPatientIdForUser(user.id);

  if (!patientId) return NextResponse.json([]);

  const supabase = await createClient();
  const { data } = await supabase
    .from('access_grants')
    .select('*')
    .eq('patient_id', patientId)
    .order('created_at', { ascending: false });
  return NextResponse.json(data ?? []);
}

export async function POST(req: NextRequest) {
  const user = await requireUser();
  const patientId = await getPatientIdForUser(user.id);
  const body = await req.json();

  if (!patientId) return NextResponse.json({ error: 'patient_not_found' }, { status: 404 });

  const supabase = await createClient();
  await supabase.from('access_grants').insert({
    patient_id: patientId,
    provider_user_id: body.providerUserId ?? user.id,
    scope: body.scope ?? 'READ',
    expires_at: body.expiresAt ?? null,
  });
  return NextResponse.json({ ok: true });
}
