import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireUser } from '@/lib/auth';
import { getPatientIdForUser } from '@/lib/patient';

export async function POST(_: Request, { params }: { params: Promise<{ attachmentId: string }> }) {
  const { attachmentId } = await params;
  const user = await requireUser();
  const supabase = await createClient();
  const { data: patient } = await supabase.from('patients').select('id').eq('user_id', user.id).single();
  const { data: att } = await supabase.from('inbox_attachments').select('*, inbox_messages(patient_id,sender_email,received_at)').eq('id', attachmentId).single();
  if (att.inbox_messages.patient_id !== patient.id) return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  await supabase.from('inbox_attachments').update({ status: 'ACCEPTED' }).eq('id', attachmentId);
  await supabase.from('documents').insert({ patient_id: patient.id, uploaded_by: user.id, source: 'INBOX', doc_type: att.suggested_type ?? 'informe', title: att.filename, document_date: att.inbox_messages.received_at, storage_path: att.storage_path ?? '', mime: att.mime, size: att.size });
  return NextResponse.json({ ok: true });
}
