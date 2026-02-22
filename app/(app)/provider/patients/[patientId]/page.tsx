import { requireUser } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';

export default async function ProviderPatientDetail({ params }: { params: Promise<{ patientId: string }> }) {
  const { patientId } = await params;
  const user = await requireUser();
  const supabase = await createClient();
  const { data: grant } = await supabase.from('access_grants').select('*').eq('patient_id', patientId).eq('provider_user_id', user.id).is('revoked_at', null).single();
  if (!grant) return <div className="card">Sin acceso</div>;
  const { data: docs } = await supabase.from('documents').select('*').eq('patient_id', patientId);
  return <div><h1 className="text-2xl font-serif">Paciente</h1><div className="mt-4 space-y-2">{(docs??[]).map(d=><div key={d.id} className="card">{d.title}</div>)}</div></div>;
}
