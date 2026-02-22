import { createClient } from '@/lib/supabase/server';

export async function getPatientIdForUser(userId: string): Promise<string | null> {
  const supabase = await createClient();
  const { data: patient } = await supabase
    .from('patients')
    .select('id')
    .eq('user_id', userId)
    .maybeSingle();

  return patient?.id ?? null;
}
