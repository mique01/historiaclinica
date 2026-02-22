import { randomUUID } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  const user = await requireUser();
  const { filename, contentType } = await req.json();
  const supabase = await createClient();
  const { data: patient } = await supabase.from('patients').select('id').eq('user_id', user.id).single();
  const path = `patient/${patient.id}/${randomUUID()}-${filename}`;
  const { data, error } = await supabase.storage.from('documents').createSignedUploadUrl(path);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ...data, path, contentType });
}
