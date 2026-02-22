import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
  const documentId = req.nextUrl.searchParams.get('documentId');
  if (!documentId) return NextResponse.json({ error: 'documentId requerido' }, { status: 400 });
  const supabase = await createClient();
  const { data: doc } = await supabase
    .from('documents')
    .select('storage_path')
    .eq('id', documentId)
    .maybeSingle();

  if (!doc) return NextResponse.json({ error: 'document_not_found' }, { status: 404 });

  const { data, error } = await supabase.storage.from('documents').createSignedUrl(doc.storage_path, 60);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.redirect(data.signedUrl);
}
