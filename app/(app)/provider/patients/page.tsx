import Link from 'next/link';
import { requireUser } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';

export default async function ProviderPatientsPage() {
  const user = await requireUser();
  const supabase = await createClient();
  const { data: grants } = await supabase.from('access_grants').select('patient_id').eq('provider_user_id', user.id).is('revoked_at', null);
  const ids = (grants ?? []).map((g) => g.patient_id);
  const { data: patients } = ids.length ? await supabase.from('patients').select('*').in('id', ids) : { data: [] as any[] };
  return <div><h1 className="text-2xl font-serif">Mis pacientes</h1><div className="mt-4 space-y-2">{(patients??[]).map(p=><Link key={p.id} className="card block" href={`/provider/patients/${p.id}`}>{p.display_name}</Link>)}</div></div>;
}
