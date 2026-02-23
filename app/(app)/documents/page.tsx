import Link from 'next/link';
import { requireUser } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { getPatientIdForUser } from '@/lib/patient';

export default async function DocumentsPage() {
  const user = await requireUser();
  const patientId = await getPatientIdForUser(user.id);

  if (!patientId) {
    return (
      <div>
        <h1 className="text-2xl font-serif">Documentos</h1>
        <div className="mt-4 card">No hay perfil de paciente asociado a esta cuenta.</div>
      </div>
    );
  }

  const supabase = await createClient();
  const { data: docs } = await supabase
    .from('documents')
    .select('*')
    .eq('patient_id', patientId)
    .order('document_date', { ascending: false });

  return (
    <div>
      <h1 className="text-2xl font-serif">Documentos</h1>
      <div className="mt-4 space-y-2">
        {(docs ?? []).map((d) => (
          <div key={d.id} className="card flex items-center justify-between">
            <span>{d.title}</span>
            <Link className="btn btn-secondary" href={`/api/storage/presign-download?documentId=${d.id}`}>
              Descargar
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
