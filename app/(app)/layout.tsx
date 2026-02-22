import { AppShell } from '@/components/app-shell';
import { getRole, requireUser } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function PrivateLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  const role = await getRole(user.id);
  if (!role) redirect('/login');
  return <AppShell role={role}>{children}</AppShell>;
}
