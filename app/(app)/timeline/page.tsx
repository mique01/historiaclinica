import { requireUser } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';

export default async function TimelinePage() {
  const user = await requireUser();
  const supabase = await createClient();
  const { data: patient } = await supabase.from('patients').select('id').eq('user_id', user.id).single();
  const { data: encounters } = await supabase.from('encounters').select('*').eq('patient_id', patient.id).order('occurred_at',{ascending:false});
  return <div><h1 className="text-2xl font-serif">Timeline</h1><div className="mt-4 space-y-2">{(encounters??[]).map((e)=> <div key={e.id} className="card">{e.reason}</div>)}</div></div>;
}
