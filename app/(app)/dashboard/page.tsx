import { createClient } from '@/lib/supabase/server';
import { requireUser } from '@/lib/auth';

export default async function DashboardPage() {
  const user = await requireUser();
  const supabase = await createClient();
  const { data: patient } = await supabase
    .from('patients')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle();

  if (!patient) {
    return (
      <div>
        <h1 className="text-2xl font-serif">Dashboard</h1>
        <div className="mt-4 card">No hay perfil de paciente asociado a esta cuenta.</div>
      </div>
    );
  }

  const { data: docs } = await supabase.from('documents').select('id').eq('patient_id', patient.id);
  return (
    <div>
      <h1 className="text-2xl font-serif">Dashboard</h1>
      <p className="text-stone-600">Resumen del paciente.</p>
      <div className="mt-4 card">Documentos: {docs?.length ?? 0}</div>
    </div>
  );
}
