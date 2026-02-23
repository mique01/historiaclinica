import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(_: Request, { params }: { params: Promise<{ attachmentId: string }> }) {
  const { attachmentId } = await params;
  const supabase = await createClient();
  await supabase.from('inbox_attachments').update({ status: 'REJECTED' }).eq('id', attachmentId);
  return NextResponse.json({ ok: true });
}
