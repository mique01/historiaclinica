import { createClient } from '@/lib/supabase/server';
import { requireUser } from '@/lib/auth';

export default async function DashboardPage() {
  const user = await requireUser();
  const supabase = await createClient();
  const { data: patient } = await supabase.from('patients').select('*').eq('user_id', user.id).maybeSingle();
  const { data: docs } = patient ? await supabase.from('documents').select('id').eq('patient_id', patient.id) : { data: [] as {id:string}[] };
  return <div><h1 className="text-2xl font-serif">Dashboard</h1><p className="text-stone-600">Resumen del paciente.</p><div className="mt-4 card">Documentos: {docs?.length ?? 0}</div></div>;
}
