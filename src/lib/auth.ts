import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import type { AppRole } from '@/types/contracts';

export async function getSessionUser() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  return data.user;
}

export async function requireUser() {
  const user = await getSessionUser();
  if (!user) redirect('/login');
  return user;
}

export async function getRole(userId: string): Promise<AppRole | null> {
  const supabase = await createClient();
  const { data } = await supabase.from('profiles').select('role').eq('id', userId).single();
  return (data?.role as AppRole) ?? null;
}
