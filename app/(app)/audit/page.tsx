import { requireUser } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';

export default async function AuditPage() {
  const user = await requireUser();
  const supabase = await createClient();
  const { data: patient } = await supabase.from('patients').select('id').eq('user_id', user.id).single();
  const { data: events } = await supabase.from('audit_events').select('*').eq('patient_id', patient.id).order('occurred_at',{ascending:false});
  return <div><h1 className="text-2xl font-serif">Auditoría</h1><div className="mt-4 space-y-2">{(events??[]).map(ev=><div key={ev.id} className="card">{ev.event_type}</div>)}</div></div>;
}
