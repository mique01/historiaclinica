import { NextRequest, NextResponse } from 'next/server';
import { getAdminClient } from '@/lib/supabase/admin';

const classify = (text: string) => {
  const t = text.toLowerCase();
  if (t.includes('receta')) return 'receta';
  if (t.includes('eco') || t.includes('rx') || t.includes('imagen')) return 'imagen';
  if (t.includes('lab') || t.includes('analisis')) return 'lab';
  return 'informe';
};

export async function POST(req: NextRequest) {
  if (req.headers.get('x-inbox-token') !== process.env.INBOX_INGEST_TOKEN) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const body = await req.json();
  const { data: msg } = await adminClient.from('inbox_messages').insert({ patient_id: body.patientId, sender_email: body.from, subject: body.subject, body_text: body.bodyText }).select().single();
  for (const att of body.attachments ?? []) {
    let storagePath: string | null = null;
    if (att.base64) {
      storagePath = `patient/${body.patientId}/inbox-${Date.now()}-${att.filename}`;
      const bin = Buffer.from(att.base64, 'base64');
      await adminClient.storage
        .from('documents')
        .upload(storagePath, bin, { contentType: att.mime || 'application/pdf', upsert: false });
    }

    await adminClient.from('inbox_attachments').insert({
      message_id: msg.id,
      filename: att.filename,
      mime: att.mime ?? 'application/pdf',
      size: att.size ?? 0,
      storage_path: storagePath,
      suggested_type: classify(`${att.filename} ${body.subject}`),
    });
  }

  return NextResponse.json({ ok: true, messageId: msg.id });
}
