import { requireUser } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { getPatientIdForUser } from '@/lib/patient';

export default async function TimelinePage() {
  const user = await requireUser();
  const patientId = await getPatientIdForUser(user.id);

  if (!patientId) {
    return (
      <div>
        <h1 className="text-2xl font-serif">Timeline</h1>
        <div className="mt-4 card">No hay perfil de paciente asociado a esta cuenta.</div>
      </div>
    );
  }

  const { data: encounters } = await supabase
    .from('encounters')
    .select('*')
    .eq('patient_id', patient.id)
    .order('occurred_at', { ascending: false });

  return (
    <div>
      <h1 className="text-2xl font-serif">Timeline</h1>
      <div className="mt-4 space-y-2">
        {(encounters ?? []).map((e) => (
          <div key={e.id} className="card">
            {e.reason}
          </div>
        ))}
      </div>
    </div>
  );
}
