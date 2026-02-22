import { requireUser } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import AcceptButton from './ui';

export default async function InboxPage() {
  const user = await requireUser();
  const supabase = await createClient();
  const { data: patient } = await supabase.from('patients').select('id').eq('user_id', user.id).single();
  const { data: msgs } = await supabase.from('inbox_messages').select('*, inbox_attachments(*)').eq('patient_id', patient.id).order('received_at',{ascending:false});
  return <div><h1 className="text-2xl font-serif">Inbox</h1>{(msgs??[]).map((m)=><div key={m.id} className="card mt-3"><div className="font-medium">{m.subject}</div><div className="mt-2 space-y-1">{m.inbox_attachments.map((a:any)=><div key={a.id} className="flex items-center justify-between rounded border p-2"><span>{a.filename} · {a.status}</span><AcceptButton id={a.id}/></div>)}</div></div>)}</div>;
}
