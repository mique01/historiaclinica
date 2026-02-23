import { requireUser } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { getPatientIdForUser } from '@/lib/patient';

export default async function AuditPage() {
  const user = await requireUser();
  const patientId = await getPatientIdForUser(user.id);

  if (!patientId) {
    return (
      <div>
        <h1 className="text-2xl font-serif">Auditoría</h1>
        <div className="mt-4 card">No hay perfil de paciente asociado a esta cuenta.</div>
      </div>
    );
  }

  const supabase = await createClient();
  const { data: events } = await supabase
    .from('audit_events')
    .select('*')
    .eq('patient_id', patientId)
    .order('occurred_at', { ascending: false });

  return (
    <div>
      <h1 className="text-2xl font-serif">Auditoría</h1>
      <div className="mt-4 space-y-2">
        {(events ?? []).map((ev) => (
          <div key={ev.id} className="card">
            {ev.event_type}
          </div>
        ))}
      </div>
    </div>
  );
}
