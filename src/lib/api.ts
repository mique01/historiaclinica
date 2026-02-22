import { createClient } from '@/lib/supabase/client';

export const api = {
  async getPatient(patientId: string) { return (await createClient().from('patients').select('*').eq('id', patientId).single()).data; },
  async getDocuments(patientId: string) { return (await createClient().from('documents').select('*').eq('patient_id', patientId).order('document_date',{ascending:false})).data ?? []; },
  async getTimeline(patientId: string) {
    const supabase = createClient();
    const [encounters, documents] = await Promise.all([
      supabase.from('encounters').select('*').eq('patient_id', patientId),
      supabase.from('documents').select('*').eq('patient_id', patientId),
    ]);
    return [...(encounters.data ?? []), ...(documents.data ?? [])];
  },
};
