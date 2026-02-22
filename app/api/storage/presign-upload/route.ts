import { randomUUID } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { getPatientIdForUser } from '@/lib/patient';

export async function POST(req: NextRequest) {
  const user = await requireUser();
  const patientId = await getPatientIdForUser(user.id);
  const { filename, contentType } = await req.json();

  if (!patientId) return NextResponse.json({ error: 'patient_not_found' }, { status: 404 });

  const supabase = await createClient();
  const path = `patient/${patientId}/${randomUUID()}-${filename}`;
  const { data, error } = await supabase.storage.from('documents').createSignedUploadUrl(path);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ...data, path, contentType });
}
